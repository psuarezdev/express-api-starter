import { Expose } from 'class-transformer';
import { IsEmail, Matches } from 'class-validator';

export class LoginDTO {
  @Expose()
  @IsEmail({}, { message: 'A valid email address is required' })
  email!: string;

  @Expose()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one letter, one number, and should be at least 8 characters long'
  })
  password!: string;
}
