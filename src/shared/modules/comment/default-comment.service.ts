import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { ICommentService } from './comment-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { IOfferService } from '../offer/offer-service.interface.js';

@injectable()
export class DefaultCommentService implements ICommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService)
    private readonly offerService: IOfferService
  ) {}

  public async create(
    dto: CreateCommentDto
  ): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({
      ...dto,
      publicationDate: new Date(),
    });

    await this.offerService.incCommentCount(dto.offerId);

    const newRating = await this.calculateRating(dto.offerId);
    await this.offerService.updateRating(dto.offerId, newRating);

    this.logger.info(`New comment created: ${dto.text}`);
    return comment;
  }

  public async findByOfferId(
    offerId: string
  ): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ offerId }).populate('author').exec();
  }

  public async findById(
    commentId: string
  ): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel.findById(commentId).exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number | null> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    if (result.deletedCount && result.deletedCount > 0) {
      await this.offerService.updateRating(offerId, 0);
    }

    return result.deletedCount;
  }

  public async deleteById(
    commentId: string
  ): Promise<DocumentType<CommentEntity> | null> {
    const deletedComment = await this.commentModel
      .findByIdAndDelete(commentId)
      .exec();

    if (deletedComment) {
      const offerId = deletedComment.offerId.toString();
      const newRating = await this.calculateRating(offerId);
      await this.offerService.updateRating(offerId, newRating);
    }

    return deletedComment;
  }

  public async updateById(
    commentId: string,
    dto: UpdateCommentDto
  ): Promise<DocumentType<CommentEntity> | null> {
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(commentId, dto, { new: true })
      .exec();

    if (updatedComment && dto.rating !== undefined) {
      const offerId = updatedComment.offerId.toString();
      const newRating = await this.calculateRating(offerId);
      await this.offerService.updateRating(offerId, newRating);
    }

    return updatedComment;
  }

  public async calculateRating(offerId: string): Promise<number> {
    const comments = await this.findByOfferId(offerId);

    if (comments.length === 0) {
      return 0;
    }

    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    );
    return Number((totalRating / comments.length).toFixed(1));
  }
}
