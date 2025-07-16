import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import { UserDTO } from '@/user/dto/user.dto';
import container from '@/di/container';
import { JwtService } from '@/shared/jwt.service';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: UserDTO;
}

const apiVersion = process.env.API_VERSION || 'v1';

const excludedPaths = [`/api/${apiVersion}/auth/login`, `/api/${apiVersion}/auth/register`, `/api/${apiVersion}/auth/refresh`];

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
  try {    
    if(excludedPaths.includes(req.originalUrl)) return next();

    const { authorization } = req.headers;

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid authorization header' });
    }

    const token = authorization.replace('Bearer ', '');

    if (!token || token.trim() === '') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const jwtService = container.get<JwtService>('JwtService');

    if(!jwtService) throw new Error('Dependency injection error');

    const user = await jwtService.verifyToken(token);

    if (!user) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    (req as any).user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Something went wrong, please try again.' });
  }
};