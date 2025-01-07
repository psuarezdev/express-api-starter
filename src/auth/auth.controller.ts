import { GET, POST, route } from 'awilix-express';
import type { Request, Response } from 'express';
import { compare } from 'bcrypt';
import { type AuthenticatedRequest } from '@/middlewares/auth';
import { JwtService } from '@/shared/jwt.service';
import { UtilsService } from '@/shared/utils.service';
import { UserService } from '@/user/user.service';
import { UserDTO } from '@/user/dto/user.dto';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@route('/api/auth')
export class AuthController {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  @route('/login')
  @POST()
  async login(req: Request, res: Response) {
    try {
      const { dto: loginDto, errors } = await this.utilsService.mapToDto(req.body, LoginDTO);

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors
        });
      }

      const userFound = await this.userService.findByEmail(loginDto.email);

      if (!userFound) {
        return res.status(403).json({ message: 'Wrong credentials' });
      }

      const passwordMatch = await compare(loginDto.password, userFound.password);

      if (!passwordMatch) {
        return res.status(403).json({ message: 'Wrong credentials' });
      }

      const user = await this.utilsService.mapToDto(userFound, UserDTO);

      if (!user.dto || Object.keys(user.errors).length > 0) {
        throw new Error('Error mapping to UserDTO');
      }

      const jwt = this.jwtService.generateToken(user.dto);

      return res.status(200).json({ user: user.dto, jwt });
    } catch {
      return res.status(500).json({
        message: 'Something went wrong, please try again.'
      });
    }
  }

  @route('/register')
  @POST()
  async register(req: Request, res: Response) {
    try {
      const { dto: registerDto, errors } = await this.utilsService.mapToDto(req.body, RegisterDTO);

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors
        });
      }

      const emailExists = await this.userService.findByEmail(registerDto.email);

      if(emailExists) {
        return res.status(409).json({
          message: 'Email is already registered'
        });
      }

      const user = await this.userService.create(registerDto);

      if (!user.dto || Object.keys(user.errors).length > 0) {
        throw new Error('Error mapping to UserDTO');
      }

      return res.status(201).json(user.dto);
    } catch {
      return res.status(500).json({
        message: 'Something went wrong, please try again.'
      });
    }
  }

  @route('/profile')
  @GET()
  async profile(req: AuthenticatedRequest, res: Response) {
    return res.status(200).json(req.user);
  }
}
