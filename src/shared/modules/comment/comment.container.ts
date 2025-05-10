import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { ICommentService } from './comment-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer
    .bind<ICommentService>(Component.CommentService)
    .to(DefaultCommentService)
    .inSingletonScope();

  commentContainer
    .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);

  return commentContainer;
}
