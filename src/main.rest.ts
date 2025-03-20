import { Container } from 'inversify';
import { RestApplication } from './rest/rest.application.js';
import { Component } from './shared/types/index.js';
import { PinoLogger, RestConfig, RestSchema } from './shared/libs/index.js';
import { IConfig } from './shared/libs/config/config.interface.js';
import { ILogger } from './shared/libs/logger/logger.interface.js';

async function bootstrap() {
  const container = new Container();
  container
    .bind<RestApplication>(Component.RestApplication)
    .to(RestApplication)
    .inSingletonScope();
  container.bind<ILogger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container
    .bind<IConfig<RestSchema>>(Component.Config)
    .to(RestConfig)
    .inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
