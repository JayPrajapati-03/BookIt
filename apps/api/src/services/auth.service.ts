import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { nanoid } from 'nanoid';
import { User, type IUser } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { AuditLog } from '../models/AuditLog.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';
import type { RegisterInput, LoginInput } from '@bookit/shared';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_DAYS = 14;

export interface TokenUserPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  static async verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  static generateAccessToken(user: IUser): string {
    const payload: TokenUserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  static verifyAccessToken(token: string): TokenUserPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenUserPayload;
    } catch {
      throw AppError.unauthorized('Invalid or expired access token');
    }
  }

  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static async issueRefreshToken(
    userId: string,
    familyId?: string,
    ip?: string,
    userAgent?: string,
  ): Promise<{ token: string; family: string }> {
    const rawToken = `${nanoid(32)}.${crypto.randomBytes(32).toString('hex')}`;
    const tokenHash = this.hashToken(rawToken);
    const family = familyId || nanoid(16);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      user: userId,
      family,
      tokenHash,
      expiresAt,
      ip,
      userAgent,
    });

    return { token: rawToken, family };
  }

  static async register(input: RegisterInput, ip?: string, userAgent?: string) {
    const existing = await User.findOne({ email: input.email });
    if (existing) {
      // Prevent account enumeration with generic response or conflict
      throw AppError.conflict('An account with this email already exists');
    }

    const passwordHash = await this.hashPassword(input.password);
    const user = await User.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: 'guest',
      status: 'active',
    });

    const accessToken = this.generateAccessToken(user);
    const { token: refreshToken } = await this.issueRefreshToken(
      user._id.toString(),
      undefined,
      ip,
      userAgent,
    );

    await AuditLog.create({
      actor: user._id,
      action: 'auth:register',
      outcome: 'success',
      ip,
      userAgent,
      at: new Date(),
    });

    return { user, accessToken, refreshToken };
  }

  static async login(input: LoginInput, ip?: string, userAgent?: string) {
    const user = await User.findOne({ email: input.email });

    // Generic error message to prevent enumeration
    const genericAuthError = AppError.unauthorized('Email or password is incorrect');

    if (!user) {
      // Perform dummy verify to mitigate timing attacks
      await this.hashPassword('dummy_timing_mitigation_password');
      await AuditLog.create({
        action: 'auth:login',
        outcome: 'denied',
        ip,
        userAgent,
        meta: { email: input.email, reason: 'User not found' },
        at: new Date(),
      });
      throw genericAuthError;
    }

    if (user.status === 'suspended') {
      throw AppError.forbidden('Your account has been suspended. Please contact support.');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw AppError.forbidden(
        'Account is temporarily locked due to multiple failed login attempts. Try again later.',
      );
    }

    const valid = await this.verifyPassword(user.passwordHash, input.password);
    if (!valid) {
      user.failedLogins += 1;
      if (user.failedLogins >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
      }
      await user.save();

      await AuditLog.create({
        actor: user._id,
        action: 'auth:login',
        outcome: 'denied',
        ip,
        userAgent,
        meta: { email: input.email, reason: 'Invalid password' },
        at: new Date(),
      });

      throw genericAuthError;
    }

    // Success
    user.failedLogins = 0;
    user.lockedUntil = undefined;
    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = this.generateAccessToken(user);
    const { token: refreshToken } = await this.issueRefreshToken(
      user._id.toString(),
      undefined,
      ip,
      userAgent,
    );

    await AuditLog.create({
      actor: user._id,
      action: 'auth:login',
      outcome: 'success',
      ip,
      userAgent,
      at: new Date(),
    });

    return { user, accessToken, refreshToken };
  }

  static async rotateRefreshToken(tokenString: string, ip?: string, userAgent?: string) {
    const tokenHash = this.hashToken(tokenString);
    const storedToken = await RefreshToken.findOne({ tokenHash });

    if (!storedToken) {
      throw AppError.unauthorized('Invalid refresh token');
    }

    // Reuse detection: If token was already revoked/replaced, revoke entire family!
    if (storedToken.revokedAt || storedToken.replacedBy) {
      await RefreshToken.updateMany(
        { family: storedToken.family },
        { revokedAt: new Date() },
      );

      await AuditLog.create({
        actor: storedToken.user,
        action: 'auth:refresh_reuse_detected',
        outcome: 'denied',
        ip,
        userAgent,
        meta: { family: storedToken.family },
        at: new Date(),
      });

      throw AppError.unauthorized('Refresh token reuse detected. All sessions in this family revoked.');
    }

    if (storedToken.expiresAt < new Date()) {
      throw AppError.unauthorized('Refresh token expired');
    }

    const user = await User.findById(storedToken.user);
    if (!user || user.status === 'suspended') {
      throw AppError.unauthorized('User not found or suspended');
    }

    // Issue new token in same family
    const { token: newRefreshToken } = await this.issueRefreshToken(
      user._id.toString(),
      storedToken.family,
      ip,
      userAgent,
    );

    // Mark current token as replaced
    storedToken.revokedAt = new Date();
    storedToken.replacedBy = this.hashToken(newRefreshToken);
    await storedToken.save();

    const accessToken = this.generateAccessToken(user);

    return { user, accessToken, refreshToken: newRefreshToken };
  }

  static async logout(tokenString: string) {
    const tokenHash = this.hashToken(tokenString);
    const storedToken = await RefreshToken.findOne({ tokenHash });
    if (storedToken) {
      // Revoke the entire family
      await RefreshToken.updateMany(
        { family: storedToken.family },
        { revokedAt: new Date() },
      );
    }
  }

  static async logoutAll(userId: string) {
    await RefreshToken.updateMany(
      { user: userId },
      { revokedAt: new Date() },
    );
  }
}
