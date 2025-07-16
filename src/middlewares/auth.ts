import type { Request, Response, NextFunction } from 'express';

import { UserDTO } from '@/user/dto/user.dto';
import container from '@/di/container';
import { JwtService } from '@/shared/jwt.service';
import { PUBLIC_ROUTES } from '@/lib/config';

export interface AuthenticatedRequest extends Request {
  user?: UserDTO;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (PUBLIC_ROUTES.includes(req.originalUrl)) return next();

    const { authorization } = req.headers;

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid authorization header' });
    }

    const token = authorization.replace('Bearer ', '');

    if (!token || token.trim() === '') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const jwtService = container.get<JwtService>('JwtService');

    if (!jwtService) throw new Error('Dependency injection error');

    const user = await jwtService.verifyToken(token);

    if (!user) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    (req as any).user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Something went wrong, please try again.' });
  }
};