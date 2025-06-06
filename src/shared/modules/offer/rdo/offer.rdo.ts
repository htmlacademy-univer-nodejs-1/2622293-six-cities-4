import { Expose } from 'class-transformer';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public commentCount: number;
}
