import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';
import { UserDTO } from '@/user/dto/user.dto';
import { UserService } from '@/user/user.service';

dotenv.config();

export interface Payload {
  sub: string;
  email: string;
  iat: Date;
  exp: Date;
}

export const JWT_SECRET = process.env.JWT_SECRET;

export class JwtService {
  constructor(private readonly userService: UserService) { }

  generateToken(payload: UserDTO, expiresIn: string | number = '1h') {
    try {
      if (!JWT_SECRET) throw new Error('JWT secret is not defined')
      const { id: sub, email } = payload;
      return jsonwebtoken.sign({ sub, email }, JWT_SECRET, { expiresIn });
    } catch {
      return null;
    }
  }

  async verifyToken(token: string) {
    try {
      if (!JWT_SECRET) throw new Error('JWT secret is not defined');
      const payload = jsonwebtoken.verify(token, JWT_SECRET) as unknown as Payload;
      return await this.userService.findById(payload.sub);
    } catch {
      return null;
    }
  }

  decodeToken(token: string) {
    try {
      return jsonwebtoken.decode(token);
    } catch {
      return null;
    }
  }
}
