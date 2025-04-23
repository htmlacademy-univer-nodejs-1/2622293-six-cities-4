import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { IOfferService } from './offer-service.interface.js';
import { DefaultOfferService } from './default-offer.service.js';

export function createOfferContainer(container: Container) {
  container.bind(Component.OfferModel).toConstantValue(OfferModel);
  container.bind(Component.OfferEntity).toConstantValue(OfferEntity);
  container
    .bind<IOfferService>(Component.OfferService)
    .to(DefaultOfferService)
    .inSingletonScope();
}
