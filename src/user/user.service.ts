import { inject, injectable } from 'inversify';
import { hash } from 'bcrypt';

import prisma from '@/lib/prisma';
import { UtilsService } from '@/shared/utils.service';
import { UserDTO } from './dto/user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from '@prisma/client';

@injectable()
export class UserService {
  constructor(
    @inject('UtilsService') private utilsService: UtilsService
  ) { }

  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return (await this.utilsService.mapToDto(user, UserDTO)).dto;
  }

  async findByUsername(username: string, includePassword = false): Promise<User | UserDTO | null> {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) return null;

    if (includePassword) {
      return user;
    }

    return (await this.utilsService.mapToDto(user, UserDTO)).dto;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return (await this.utilsService.mapToDto(user, UserDTO)).dto;
  }

  async create(dto: CreateUserDTO) {
    const user = await prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password, 10)
      }
    });

    return await this.utilsService.mapToDto(user, UserDTO);
  }
}