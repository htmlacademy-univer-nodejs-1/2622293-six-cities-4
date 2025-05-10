import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { IFavoriteService } from './favorite-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { DefaultFavoriteService } from './default-favorite.service.js';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';

export function createFavoriteContainer() {
  const favoriteContainer = new Container();

  favoriteContainer
    .bind<IFavoriteService>(Component.FavoriteService)
    .to(DefaultFavoriteService)
    .inSingletonScope();

  favoriteContainer
    .bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel)
    .toConstantValue(FavoriteModel);

  return favoriteContainer;
}
