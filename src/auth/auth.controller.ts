import { compare } from 'bcrypt';
import { inject } from 'inversify';
import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  request,
  response
} from 'inversify-express-utils';

import { UserService } from '@/user/user.service';
import { UtilsService } from '@/shared/utils.service';
import { JwtService } from '@/shared/jwt.service';
import { Request, Response } from 'express';
import { LoginDTO } from './dto/login.dto';
import { AuthenticatedRequest } from '@/middlewares/auth';
import { UserDTO } from '@/user/dto/user.dto';
import { RegisterDTO } from './dto/register.dto';

@controller('/auth')
export class AuthController implements interfaces.Controller {
  constructor(
    @inject('UserService') private userService: UserService,
    @inject('UtilsService') private utilsService: UtilsService,
    @inject('JwtService') private jwtService: JwtService,
  ) { }

  @httpGet('/me')
  public async me(@request() req: AuthenticatedRequest, @response() res: Response) {
    return res.status(200).json(req.user);
  }

  @httpPost('/login')
  public async login(@request() req: Request, @response() res: Response) {
    try {
      const { dto: loginDto, errors } = await this.utilsService.mapToDto(req.body, LoginDTO);

      if (!loginDto || Object.keys(errors).length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors
        });
      }

      const userFound = await this.userService.findByUsername(loginDto.username, true);

      if (!userFound) {
        return res.status(403).json({ message: 'Wrong credentials' });
      }

      const passwordMatch = await compare(loginDto.password, userFound.password);

      if (!passwordMatch) {
        return res.status(403).json({ message: 'Wrong credentials' });
      }

      const user = await this.utilsService.mapToDto(userFound, UserDTO);

      if (!user.dto || Object.keys(user.errors).length > 0) {
        throw new Error('Error getting user data');
      }

      const tokens = this.jwtService.generateTokens(user.dto);

      return res.status(200).json({ user: user.dto, ...tokens });
    } catch {
      return res.status(500).json({
        message: 'Something went wrong, please try again.'
      });
    }
  }

  @httpPost('/register')
  public async register(@request() req: Request, @response() res: Response) {
    try {
      const { dto: registerDto, errors } = await this.utilsService.mapToDto(req.body, RegisterDTO);

      if (!registerDto || Object.keys(errors).length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors
        });
      }

      const usernameExists = await this.userService.findByUsername(registerDto.username);

      if (usernameExists) {
        return res.status(409).json({
          message: 'Username is already taken'
        });
      }

      const emailExists = registerDto.email
        ? await this.userService.findByEmail(registerDto.email)
        : null;

      if (emailExists) {
        return res.status(409).json({
          message: 'Email is already registered'
        });
      }      

      const user = await this.userService.create(registerDto);

      if (!user.dto || Object.keys(user.errors).length > 0) {
        throw new Error('Error mapping to UserDTO');
      }

      const tokens = this.jwtService.generateTokens(user.dto);

      return res.status(201).json({
        user: user.dto,
        ...tokens
      });
    } catch {
      return res.status(500).json({
        message: 'Something went wrong, please try again.'
      });
    }
  }

  @httpPost('/refresh')
  public async refresh(@request() req: Request, @response() res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token || token.trim() === '') {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const isValid = await this.jwtService.verifyRefreshToken(token);

      if (!isValid) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const accessToken = await this.jwtService.refreshToken(token);

      return res.status(200).json({ accessToken });
    } catch {
      return res.status(500).json({
        message: 'Something went wrong, please try again.'
      });
    }
  }
}