import {
  IsString,
  IsNumber,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsMongoId,
} from 'class-validator';
import { CreateCommentValidationMessage } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString()
  @MinLength(5, { message: CreateCommentValidationMessage.text.minLength })
  @MaxLength(1024, { message: CreateCommentValidationMessage.text.maxLength })
  public text!: string;

  @IsNumber({}, { message: CreateCommentValidationMessage.rating.min })
  @Min(1, { message: CreateCommentValidationMessage.rating.min })
  @Max(5, { message: CreateCommentValidationMessage.rating.max })
  public rating!: number;

  @IsString({ message: CreateCommentValidationMessage.author.empty })
  @IsMongoId({ message: CreateCommentValidationMessage.author.invalidId })
  public author!: string;

  @IsString({ message: CreateCommentValidationMessage.offerId.empty })
  @IsMongoId({ message: CreateCommentValidationMessage.offerId.invalidId })
  public offerId!: string;
}
