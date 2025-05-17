import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

export interface ICommentService {
  findByOfferId(id: string): Promise<DocumentType<CommentEntity>[]>;
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
}
