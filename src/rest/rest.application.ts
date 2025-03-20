import { inject, injectable } from 'inversify';
import { IConfig } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/index.js';
import { ILogger } from '../shared/libs/logger/logger.interface.js';
import { Component } from '../shared/types/component.enum.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>
  ) {}

  public async init() {
    this.logger.info('REST API started');
    this.logger.info(`Get value from env PORT: ${this.config.get('PORT')}`);
  }
}
