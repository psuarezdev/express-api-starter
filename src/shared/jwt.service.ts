import { inject, injectable } from 'inversify';
import jwt, { SignOptions } from 'jsonwebtoken';

import { UserDTO } from '@/user/dto/user.dto';
import { UserService } from '@/user/user.service';
import { UtilsService } from './utils.service';
import {
  EXPIRES_IN as ENV_EXPIRES_IN,
  REFRESH_EXPIRES_IN as ENV_REFRESH_EXPIRES_IN,
  JWT_SECRET as ENV_JWT_SECRET,
  REFRESH_JWT_SECRET as ENV_REFRESH_JWT_SECRET
} from '@/lib/config';


export interface Payload {
  sub: string;
  username: string;
  iat: Date;
  exp: Date;
}

const JWT_SECRET: string = ENV_JWT_SECRET || '';
const EXPIRES_IN: string = ENV_EXPIRES_IN || '1h';
const REFRESH_JWT_SECRET: string = ENV_REFRESH_JWT_SECRET || '';
const REFRESH_EXPIRES_IN: string = ENV_REFRESH_EXPIRES_IN || '7d';

@injectable()
export class JwtService {
  constructor(
    @inject('UserService') private userService: UserService,
    @inject('UtilsService') private utilsService: UtilsService
  ) { }

  generateTokens(payload: UserDTO) {
    try {
      if (!JWT_SECRET || !REFRESH_JWT_SECRET) {
        throw new Error('JWT secret is not defined');
      }

      const { id: sub, username } = payload;
      return {
        accessToken: jwt.sign(
          { sub, username },
          JWT_SECRET,
          { expiresIn: EXPIRES_IN } as SignOptions
        ),
        refreshToken: jwt.sign(
          { sub, username },
          REFRESH_JWT_SECRET,
          { expiresIn: REFRESH_EXPIRES_IN } as SignOptions
        )
      };
    } catch {
      return null;
    }
  }

  async verifyToken(token: string) {
    try {
      if (!JWT_SECRET) throw new Error('JWT secret is not defined');
      const payload = jwt.verify(token, JWT_SECRET) as unknown as Payload;
      return await this.userService.findById(payload.sub);
    } catch {
      return null;
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      if (!REFRESH_JWT_SECRET) throw new Error('Refresh JWT secret is not defined');
      const payload = jwt.verify(token, REFRESH_JWT_SECRET) as unknown as Payload;
      return await this.userService.findById(payload.sub);
    } catch {
      return null;
    }
  }

  async refreshToken(token: string) {
    try {
      if (!JWT_SECRET || !REFRESH_JWT_SECRET) {
        throw new Error('JWT secret is not defined');
      }

      const payload = jwt.verify(token, REFRESH_JWT_SECRET) as unknown as Payload;

      const userFound = await this.userService.findById(payload.sub);
      if (!userFound) return null;

      const user = await this.utilsService.mapToDto(userFound, UserDTO);
      if (!user.dto) return null;

      return this.generateTokens(user.dto)?.accessToken;
    } catch {
      return null;
    }
  }

  decodeToken(token: string) {
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  }
}