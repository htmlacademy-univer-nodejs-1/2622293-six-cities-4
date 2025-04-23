import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { DefaultUserService } from './default-user.service.js';
import { UserService } from './user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';
import { ModelType } from '@typegoose/typegoose/lib/types.js';

export function createUserContainer(userContainer: Container) {
  userContainer
    .bind<UserService>(Component.UserService)
    .to(DefaultUserService)
    .inSingletonScope();

  userContainer
    .bind<ModelType<UserEntity>>(Component.UserModel)
    .toConstantValue(UserModel);

  return userContainer;
}
