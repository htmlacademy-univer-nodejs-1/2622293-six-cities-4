import { Container } from 'inversify';
import { Component } from '../shared/types/component.enum.js';
import { RestApplication } from './rest.application.js';
import {
  DatabaseClient,
  MongoDatabaseClient,
} from '../shared/libs/database-client/index.js';
import { IConfig } from '../shared/libs/config/config.interface.js';
import { PinoLogger, RestSchema, RestConfig } from '../shared/libs/index.js';
import { ILogger } from '../shared/libs/logger/logger.interface.js';
import { ExceptionFilter } from '../shared/libs/rest/exception-filter/exception-filter.interface.js';
import { AppExceptionFilter } from '../shared/libs/rest/exception-filter/app-exception-filter.js';
import { UserController } from '../shared/modules/user/user.controller.js';

export function createRestApplicationContainer(restContainer: Container) {
  restContainer
    .bind<RestApplication>(Component.RestApplication)
    .to(RestApplication)
    .inSingletonScope();
  restContainer
    .bind<ILogger>(Component.Logger)
    .to(PinoLogger)
    .inSingletonScope();
  restContainer
    .bind<IConfig<RestSchema>>(Component.Config)
    .to(RestConfig)
    .inSingletonScope();
  restContainer
    .bind<DatabaseClient>(Component.DatabaseClient)
    .to(MongoDatabaseClient)
    .inSingletonScope();

  restContainer
    .bind<ExceptionFilter>(Component.AppExceptionFilter)
    .to(AppExceptionFilter)
    .inSingletonScope();

  restContainer
    .bind<UserController>(Component.UserController)
    .to(UserController);

  return restContainer;
}
