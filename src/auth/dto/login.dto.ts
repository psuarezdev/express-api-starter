import { Expose } from 'class-transformer';
import { Matches, MinLength } from 'class-validator';

export class LoginDTO {
  @Expose()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username!: string;

  @Expose()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one letter, one number, and should be at least 8 characters long'
  })
  password!: string;
}