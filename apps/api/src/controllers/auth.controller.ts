import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '@bookit/shared';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';
import { User } from '../models/User.js';

export class AuthController {
  private static setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.get('user-agent');

      const { user, accessToken, refreshToken } = await AuthService.register(
        validated,
        ip,
        userAgent,
      );

      AuthController.setRefreshCookie(res, refreshToken);

      res.status(201).json({
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.get('user-agent');

      const { user, accessToken, refreshToken } = await AuthService.login(validated, ip, userAgent);

      AuthController.setRefreshCookie(res, refreshToken);

      res.status(200).json({
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!refreshToken) {
        throw AppError.unauthorized('Refresh token missing');
      }

      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.get('user-agent');

      const {
        user,
        accessToken,
        refreshToken: newRefreshToken,
      } = await AuthService.rotateRefreshToken(refreshToken, ip, userAgent);

      AuthController.setRefreshCookie(res, newRefreshToken);

      res.status(200).json({
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      res.clearCookie('refreshToken', { path: '/api/v1/auth' });
      res.status(200).json({ data: { message: 'Logged out successfully' } });
    } catch (err) {
      next(err);
    }
  }

  static async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw AppError.unauthorized();
      await AuthService.logoutAll(req.user.id);
      res.clearCookie('refreshToken', { path: '/api/v1/auth' });
      res.status(200).json({ data: { message: 'Logged out from all sessions' } });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw AppError.unauthorized();
      const user = await User.findById(req.user.id).select('-passwordHash');
      if (!user) throw AppError.notFound('User not found');
      res.status(200).json({ data: { user } });
    } catch (err) {
      next(err);
    }
  }
}
