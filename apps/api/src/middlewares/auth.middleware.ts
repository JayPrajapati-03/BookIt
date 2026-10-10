import type { Request, Response, NextFunction } from 'express';
import { AuthService, type TokenUserPayload } from '../services/auth.service.js';
import { hasPermission, type Permission, type UserRole } from '@bookit/shared';
import { AuditLog } from '../models/AuditLog.js';
import { AppError } from '../utils/errors.js';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: TokenUserPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Authentication token missing'));
  }

  const token = authHeader.substring(7);
  try {
    const payload = AuthService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      req.user = AuthService.verifyAccessToken(token);
    } catch {
      // Ignored for optional auth
    }
  }
  next();
}

export function authorize(permission: Permission) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    const role = req.user.role as UserRole;
    const allowed = hasPermission(role, permission);

    if (!allowed) {
      // Log denied attempt in AuditLog
      try {
        await AuditLog.create({
          actor: new mongoose.Types.ObjectId(req.user.id),
          action: `permission:${permission}`,
          target: req.originalUrl,
          outcome: 'denied',
          ip: req.ip || req.socket.remoteAddress,
          userAgent: req.get('user-agent'),
          meta: { role, method: req.method },
          at: new Date(),
        });
      } catch (err) {
        // Continue even if audit write fails
      }

      return next(AppError.forbidden(`Forbidden: Missing required permission [${permission}]`));
    }

    next();
  };
}
