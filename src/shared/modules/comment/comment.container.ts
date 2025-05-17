import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { ICommentService } from './comment-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { CommentController } from './comment.controller.js';

export function createCommentContainer(container: Container) {
  container
    .bind<ICommentService>(Component.CommentService)
    .to(DefaultCommentService)
    .inSingletonScope();

  container
    .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);

  container
    .bind<CommentController>(Component.CommentController)
    .to(CommentController)
    .inSingletonScope();

  return container;
}
