import { inject, injectable } from 'inversify';
import { IConfig } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/index.js';
import { ILogger } from '../shared/libs/logger/logger.interface.js';
import { Component } from '../shared/types/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient
  ) {}

  private async _initDb() {
    const uri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return this.databaseClient.connect(uri);
  }

  public async init() {
    this.logger.info('REST API started');
    this.logger.info(`Get value from env PORT: ${this.config.get('PORT')}`);

    this.logger.info('Initializing database...');
    await this._initDb();
    this.logger.info('Database connection established');
  }
}
