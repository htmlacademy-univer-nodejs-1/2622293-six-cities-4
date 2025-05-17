import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { LoginUserValidationMessage } from './login-user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: LoginUserValidationMessage.email.invalid })
  @IsString({ message: LoginUserValidationMessage.email.empty })
  public email!: string;

  @IsString({ message: LoginUserValidationMessage.password.empty })
  @MinLength(6, { message: LoginUserValidationMessage.password.minLength })
  @MaxLength(12, { message: LoginUserValidationMessage.password.maxLength })
  public password!: string;
}
