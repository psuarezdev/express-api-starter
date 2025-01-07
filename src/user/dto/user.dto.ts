import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserDTO {
  @Expose()
  @IsNotEmpty({ message: 'ID cannot be empty' })
  id!: string;

  @Expose()
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  firstName!: string;

  @Expose()
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  lastName!: string;

  @Expose()
  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;

  @Expose()
  avatar!: string;

  @Exclude()
  password!: string;
}
