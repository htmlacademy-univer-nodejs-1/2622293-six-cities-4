import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { IOfferService } from './offer-service.interface.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferController } from './offer.controller.js';
import { types } from '@typegoose/typegoose';

export function createOfferContainer(container: Container) {
  container.bind<IOfferService>(Component.OfferService).to(DefaultOfferService);
  container
    .bind<types.ModelType<OfferEntity>>(Component.OfferModel)
    .toConstantValue(OfferModel);
  container
    .bind<OfferController>(Component.OfferController)
    .to(OfferController);

  return container;
}
