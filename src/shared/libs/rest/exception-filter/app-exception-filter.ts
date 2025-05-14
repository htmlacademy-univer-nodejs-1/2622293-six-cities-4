import { NextFunction, Response, Request } from 'express';
import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Component } from '../../../types/component.enum.js';
import { Logger } from 'pino';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../error/http-error.js';
import { createErrorObject } from '../../../helpers/common.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register AppExceptionFilter');
  }

  public handleHttpError(
    error: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    this.logger.error(`[${error.detail}] ${error.message}`);
    res.status(error.httpStatusCode).json(createErrorObject(error.message));
  }

  public handleOtherError(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    this.logger.error(`[${error.name}] ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }

  public catch(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (error instanceof HttpError) {
      this.handleHttpError(error, _req, res, next);
      return;
    }

    this.handleOtherError(error, _req, res, next);
  }
}
