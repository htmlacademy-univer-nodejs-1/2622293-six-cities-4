import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { IOfferService } from './offer-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { City, Housing } from '../../types/offer.js';

@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? 60;
    return this.offerModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async findPremiumByCity(
    city: City
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .exec();
  }

  public async findByCity(
    city: City,
    count?: number
  ): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? 60;
    return this.offerModel
      .find({ city })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  public async findByHousingType(
    type: Housing,
    count?: number
  ): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? 60;
    return this.offerModel
      .find({ housing: type })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  public async findByAuthor(
    authorId: string
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ author: authorId })
      .sort({ createdAt: -1 })
      .exec();
  }

  public async incCommentCount(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { $inc: { commentCount: 1 } }, { new: true })
      .exec();
  }

  public async findNew(count: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().sort({ createdAt: -1 }).limit(count).exec();
  }

  public async findDiscussed(
    count: number
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({ commentCount: -1 })
      .limit(count)
      .exec();
  }

  public async updateRating(
    offerId: string,
    rating: number
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { rating }, { new: true })
      .exec();
  }
}
