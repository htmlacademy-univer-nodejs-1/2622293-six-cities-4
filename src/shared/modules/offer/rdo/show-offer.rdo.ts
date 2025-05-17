import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

class LocationRdo {
  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;
}

export class ShowOfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose({ name: 'author' })
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
  public commentCount: number;

  @Expose()
  public description: string;

  @Expose()
  public price: number;

  @Expose()
  public rating: number;

  @Expose()
  public city: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public previewImage: string;

  @Expose()
  public date: string;

  @Expose()
  public housing: string;

  @Expose()
  @Type(() => LocationRdo)
  public location: LocationRdo;

  @Expose()
  public images: string[];

  @Expose()
  public rooms: number;

  @Expose()
  public guests: number;

  @Expose()
  public amenities: string[];
}
