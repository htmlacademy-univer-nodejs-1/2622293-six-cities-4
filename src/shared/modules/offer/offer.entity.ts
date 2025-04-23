import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { City, Housing, Amenities, IOffer } from '../../types/offer.js';

class Location {
  @prop({ required: true, type: () => Number })
  public latitude!: number;

  @prop({ required: true, type: () => Number })
  public longitude!: number;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps implements IOffer {
  @prop({
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 100,
    type: () => String,
  })
  public title!: string;

  @prop({
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 1024,
    type: () => String,
  })
  public description!: string;

  @prop({ required: true, type: () => Date })
  public date!: Date;

  @prop({ required: true, enum: City, type: () => String })
  public city!: City;

  @prop({ required: true, type: () => String })
  public previewImage!: string;

  @prop({ required: true, type: () => [String] })
  public images!: string[];

  @prop({ required: true, type: () => Boolean })
  public isPremium!: boolean;

  @prop({ required: true, min: 1, max: 5, type: () => Number })
  public rating!: number;

  @prop({ required: true, enum: Housing, type: () => String })
  public housing!: Housing;

  @prop({ required: true, min: 1, max: 8, type: () => Number })
  public rooms!: number;

  @prop({ required: true, min: 1, max: 10, type: () => Number })
  public guests!: number;

  @prop({ required: true, min: 100, max: 100000, type: () => Number })
  public price!: number;

  @prop({
    required: true,
    type: () => [String],
    enum: Amenities,
  })
  public amenities!: Amenities[];

  @prop({ required: true, type: () => String })
  public author!: string;

  @prop({ required: true, type: () => Location, _id: false })
  public location!: Location;

  constructor(offerData: IOffer) {
    super();

    this.title = offerData.title;
    this.description = offerData.description;
    this.date = offerData.date;
    this.city = offerData.city;
    this.previewImage = offerData.previewImage;
    this.images = offerData.images;
    this.isPremium = offerData.isPremium;
    this.rating = offerData.rating;
    this.housing = offerData.housing;
    this.rooms = offerData.rooms;
    this.guests = offerData.guests;
    this.price = offerData.price;
    this.amenities = offerData.amenities;
    this.author = offerData.author;
    this.location = offerData.location as Location;
  }
}

export const OfferModel = getModelForClass(OfferEntity);
