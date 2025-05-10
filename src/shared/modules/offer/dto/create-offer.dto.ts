import { City, Housing, Amenities } from '../../../types/offer.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public date!: Date;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public rating!: number;
  public housing!: Housing;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public amenities!: Amenities[];
  public author!: string;
  public location!: {
    latitude: number;
    longitude: number;
  };
  public commentCount?: number;
}
