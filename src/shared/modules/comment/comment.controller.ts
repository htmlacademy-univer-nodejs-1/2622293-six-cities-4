import { injectable, inject } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from 'pino';
import { ICommentService } from './comment-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { IOfferService } from '../offer/offer-service.interface.js';
import { CreateCommentRequest } from './types/create-comment.request.js';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../libs/rest/error/http-error.js';
import { Response } from 'express';
import { fillDTO } from '../../helpers/common.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService)
    private readonly commentService: ICommentService,
    @inject(Component.OfferService) private readonly offerService: IOfferService
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateCommentDto)],
    });
  }

  public async create(
    { body }: CreateCommentRequest,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(body.offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'CommentController'
      );
    }

    const comment = await this.commentService.create({
      ...body,
      offerId: offer.id,
    });

    this.created(res, fillDTO(CommentRdo, comment));
  }
}
