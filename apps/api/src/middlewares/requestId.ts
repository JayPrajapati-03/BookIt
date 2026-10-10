import type { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const reqId = (req.header('x-request-id') as string) || nanoid(12);
  req.id = reqId;
  res.setHeader('x-request-id', reqId);
  next();
}
