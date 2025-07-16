import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UserDTO {
  @Expose()
  @IsNotEmpty({ message: 'ID cannot be empty' })
  id!: string;

  @Expose()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username!: string;

  @Expose()
  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;

  @Exclude()
  password!: string;
}