import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { IFavoriteService } from './favorite-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { OfferEntity } from '../offer/offer.entity.js';

@injectable()
export class DefaultFavoriteService implements IFavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.FavoriteModel)
    private readonly favoriteModel: types.ModelType<FavoriteEntity>,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(
    dto: CreateFavoriteDto
  ): Promise<DocumentType<FavoriteEntity>> {
    const favorite = await this.favoriteModel.create(dto);
    this.logger.info(
      `New favorite created: ${dto.offerId} for user ${dto.userId}`
    );
    return favorite;
  }

  public async findByUserId(
    userId: string
  ): Promise<DocumentType<FavoriteEntity>[]> {
    return this.favoriteModel.find({ userId }).populate('offerId').exec();
  }

  public async deleteByOfferId(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel.findOneAndDelete({ offerId, userId }).exec();
  }

  public async findByOfferAndUserId(
    offerId: string,
    userId: string
  ): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel.findOne({ offerId, userId }).exec();
  }

  public async toggleFavorite(offerId: string, userId: string): Promise<void> {
    const existingFavorite = await this.findByOfferAndUserId(offerId, userId);

    if (existingFavorite) {
      await this.deleteByOfferId(offerId, userId);
      this.logger.info(`Favorite removed: ${offerId} for user ${userId}`);
    } else {
      await this.create({ offerId, userId });
      this.logger.info(`Favorite added: ${offerId} for user ${userId}`);
    }
  }

  public async getFavoriteOffers(
    userId: string
  ): Promise<DocumentType<OfferEntity>[]> {
    const favorites = await this.findByUserId(userId);
    const offerIds = favorites.map((favorite) => favorite.offerId);

    return this.offerModel.find({ _id: { $in: offerIds } }).exec();
  }

  public async isFavorite(offerId: string, userId: string): Promise<boolean> {
    const favorite = await this.findByOfferAndUserId(offerId, userId);
    return favorite !== null;
  }
}
