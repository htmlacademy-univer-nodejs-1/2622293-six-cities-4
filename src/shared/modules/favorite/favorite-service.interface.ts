import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { OfferEntity } from '../offer/offer.entity.js';

export interface IFavoriteService {
  create(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>>;
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  deleteByOfferId(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity> | null>;
  findByOfferAndUserId(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity> | null>;
  toggleFavorite(offerId: string, userId: string): Promise<void>;
  getFavoriteOffers(userId: string): Promise<DocumentType<OfferEntity>[]>;
  isFavorite(offerId: string, userId: string): Promise<boolean>;
}
