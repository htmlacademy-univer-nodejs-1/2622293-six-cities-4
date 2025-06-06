import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { IUser, UserType } from '../../types/user.js';
import { createSHA256 } from '../../helpers/hash.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements IUser {
  @prop({ unique: true, required: true })
  public email = '';

  @prop({ required: true })
  public name = '';

  @prop({ required: false, default: '' })
  public avatar = '';

  @prop({ required: true, enum: Object.values(UserType) })
  public userType = UserType.Normal;

  @prop({ required: true, default: '' })
  private password = '';

  @prop({ required: false, default: [], type: () => [String] })
  public favoriteOffers: string[] = [];

  constructor(userData: IUser) {
    super();
    this.email = userData.email;
    this.name = userData.name;
    this.avatar = userData.avatar ?? '';
    this.userType = userData.userType;
    this.favoriteOffers = [];
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
