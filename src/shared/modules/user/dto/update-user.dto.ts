import { UserType } from '../../../types/user.js';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsUrl,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { CreateUserValidationMessage } from './create-user.messages.js';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: CreateUserValidationMessage.name.empty })
  @MinLength(1, { message: CreateUserValidationMessage.name.minLength })
  @MaxLength(15, { message: CreateUserValidationMessage.name.maxLength })
  public name?: string;

  @IsOptional()
  @IsEmail({}, { message: CreateUserValidationMessage.email.invalid })
  @IsString({ message: CreateUserValidationMessage.email.empty })
  public email?: string;

  @IsOptional()
  @IsUrl({}, { message: CreateUserValidationMessage.avatar.invalid })
  @Matches(/\.(jpg|png)$/i, {
    message: CreateUserValidationMessage.avatar.format,
  })
  public avatar?: string;

  @IsOptional()
  @IsEnum(UserType, { message: CreateUserValidationMessage.userType.invalid })
  public userType?: UserType;
}
