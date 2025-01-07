import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDTO {
  @Expose()
  @IsNotEmpty({ message: 'First name is required' })
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  firstName!: string;

  @Expose()
  @IsNotEmpty({ message: 'Last name is required' })
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  lastName!: string;

  @Expose()
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
