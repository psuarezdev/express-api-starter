import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches, MinLength } from 'class-validator';

export class CreateUserDTO {
  @Expose()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username!: string;

  @Expose()
  @IsOptional()
  @IsEmail({}, { message: 'A valid email address is required' })
  email!: string;

  @Expose()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 100, { message: 'Password must be between 6 and 100 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one letter, one number, and should be at least 8 characters long'
  })
  password!: string;
}