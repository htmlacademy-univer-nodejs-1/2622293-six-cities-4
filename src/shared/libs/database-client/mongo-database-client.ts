import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import mongoose from 'mongoose';
import { DatabaseClient } from './database-client.interface.js';
import { ILogger } from '../logger/logger.interface.js';

const RETRY_COUNT = 5;
const RETRY_INTERVAL = 1000;

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private isConnected = false;

  constructor(@inject(Component.Logger) private readonly logger: ILogger) {}

  public isConnectedToTheDatabase(): boolean {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToTheDatabase()) {
      throw new Error('MongoDB client already connected');
    }

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        await mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info(`Connected to the database by uri: ${uri}`);
        return;
      } catch (error) {
        this.logger.error(
          `Failed to connect to the database by uri: ${uri}`,
          error as Error
        );
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      }

      throw new Error(
        `Failed to connect to the database after ${attempt} attempts`
      );
    }
    this.logger.info(`Try to connect to the database by uri: ${uri}`);

    await mongoose.connect(uri);
    this.isConnected = true;

    this.logger.info('Database connected');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToTheDatabase()) {
      throw new Error('Not connected to the database');
    }

    await mongoose.disconnect?.();
    this.isConnected = false;
    this.logger.info('Database disconnected');
  }
}
