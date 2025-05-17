import { City, Housing, Amenities } from '../../../types/offer.js';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsUrl,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsDateString,
  MinLength,
  MaxLength,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

class LocationDto {
  @IsNumber({}, { message: CreateOfferValidationMessage.location.latitude })
  public latitude!: number;

  @IsNumber({}, { message: CreateOfferValidationMessage.location.longitude })
  public longitude!: number;
}

export class CreateOfferDto {
  @IsString()
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title!: string;

  @IsString()
  @MinLength(20, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  public description!: string;

  @IsDateString(
    {},
    { message: CreateOfferValidationMessage.date.invalidFormat }
  )
  public date!: Date;

  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalidValue })
  public city!: City;

  @IsString()
  @IsUrl(
    {},
    { message: CreateOfferValidationMessage.previewImage.invalidFormat }
  )
  public previewImage!: string;

  @IsArray()
  @ArrayMinSize(6, {
    message: CreateOfferValidationMessage.images.invalidCount,
  })
  @ArrayMaxSize(6, {
    message: CreateOfferValidationMessage.images.invalidCount,
  })
  @IsUrl(
    {},
    { each: true, message: CreateOfferValidationMessage.images.invalidFormat }
  )
  public images!: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium!: boolean;

  @IsNumber({}, { message: CreateOfferValidationMessage.rating.min })
  @Min(1, { message: CreateOfferValidationMessage.rating.min })
  @Max(5, { message: CreateOfferValidationMessage.rating.max })
  public rating!: number;

  @IsEnum(Housing, {
    message: CreateOfferValidationMessage.housing.invalidValue,
  })
  public housing!: Housing;

  @IsNumber({}, { message: CreateOfferValidationMessage.rooms.min })
  @Min(1, { message: CreateOfferValidationMessage.rooms.min })
  @Max(8, { message: CreateOfferValidationMessage.rooms.max })
  public rooms!: number;

  @IsNumber({}, { message: CreateOfferValidationMessage.guests.min })
  @Min(1, { message: CreateOfferValidationMessage.guests.min })
  @Max(10, { message: CreateOfferValidationMessage.guests.max })
  public guests!: number;

  @IsNumber({}, { message: CreateOfferValidationMessage.price.min })
  @Min(100, { message: CreateOfferValidationMessage.price.min })
  @Max(100000, { message: CreateOfferValidationMessage.price.max })
  public price!: number;

  @IsArray({ message: CreateOfferValidationMessage.amenities.empty })
  @ArrayMinSize(1, { message: CreateOfferValidationMessage.amenities.empty })
  @IsEnum(Amenities, {
    each: true,
    message: CreateOfferValidationMessage.amenities.invalidValue,
  })
  public amenities!: Amenities[];

  @IsString({ message: CreateOfferValidationMessage.author.empty })
  @IsMongoId({ message: CreateOfferValidationMessage.author.invalidId })
  public author!: string;

  @ValidateNested({
    message: CreateOfferValidationMessage.location.invalidFormat,
  })
  @Type(() => LocationDto)
  public location!: {
    latitude: number;
    longitude: number;
  };

  public commentCount?: number;
}
//фикс билды
