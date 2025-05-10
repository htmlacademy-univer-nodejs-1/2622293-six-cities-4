import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

export interface ICommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  findById(commentId: string): Promise<DocumentType<CommentEntity> | null>;
  deleteByOfferId(offerId: string): Promise<number | null>;
  deleteById(commentId: string): Promise<DocumentType<CommentEntity> | null>;
  updateById(
    commentId: string,
    dto: UpdateCommentDto
  ): Promise<DocumentType<CommentEntity> | null>;
  calculateRating(offerId: string): Promise<number>;
}
