import { IsString, MinLength, MaxLength } from 'class-validator';
import { UpdatePasswordValidationMessage } from './update-password.messages.js';

export class UpdatePasswordDto {
  @IsString({ message: UpdatePasswordValidationMessage.oldPassword.empty })
  @MinLength(6, {
    message: UpdatePasswordValidationMessage.oldPassword.minLength,
  })
  @MaxLength(12, {
    message: UpdatePasswordValidationMessage.oldPassword.maxLength,
  })
  public oldPassword!: string;

  @IsString({ message: UpdatePasswordValidationMessage.newPassword.empty })
  @MinLength(6, {
    message: UpdatePasswordValidationMessage.newPassword.minLength,
  })
  @MaxLength(12, {
    message: UpdatePasswordValidationMessage.newPassword.maxLength,
  })
  public newPassword!: string;
}
