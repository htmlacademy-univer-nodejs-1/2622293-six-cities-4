import { inject, injectable } from 'inversify';
import { IConfig } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/index.js';
import { ILogger } from '../shared/libs/logger/logger.interface.js';
import { Component } from '../shared/types/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import express, { Express } from 'express';
import { OfferController } from '../shared/modules/offer/offer.controller.js';
import { ExceptionFilter } from '../shared/libs/rest/exception-filter/exception-filter.interface.js';
import { UserController } from '../shared/modules/user/user.controller.js';
import { CommentController } from '../shared/modules/comment/comment.controller.js';

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferController)
    private readonly offerController: OfferController,
    @inject(Component.AppExceptionFilter)
    private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.UserController)
    private readonly userController: UserController,
    @inject(Component.CommentController)
    private readonly commentController: CommentController
  ) {
    this.server = express();
  }

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

  private async _initServer() {
    const PORT = this.config.get('PORT');
    this.server.listen(PORT);
  }

  private async _initControllers() {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/comments', this.commentController.router);
  }

  private async _initMiddleware() {
    this.server.use(express.json());
  }

  private async _initExceptionFilters() {
    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter)
    );
  }

  public async init() {
    this.logger.info('REST API started');
    this.logger.info(`Get value from env PORT: ${this.config.get('PORT')}`);

    this.logger.info('Initializing database...');
    await this._initDb();
    this.logger.info('Database connection established');

    this.logger.info('Initializing middleware...');
    await this._initMiddleware();
    this.logger.info('Middleware initialized');

    this.logger.info('Initializing controllers...');
    await this._initControllers();
    this.logger.info('Controllers initialized');

    this.logger.info('Initializing exception filters...');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialized');

    this.logger.info('Initializing server...');
    await this._initServer();
    this.logger.info(`Server started on port ${this.config.get('PORT')}`);
  }
}
