import { IComment } from './comment.js';
import { IRentalOffer } from './rentalOffer.js';
import { IUser } from './user.js';

export interface IMockServerData {
  offers: IRentalOffer[];
  comments: IComment[];
  users: IUser[];
}
