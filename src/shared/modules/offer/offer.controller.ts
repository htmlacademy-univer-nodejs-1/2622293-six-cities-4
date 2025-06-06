import { inject, injectable } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from 'pino';
import { City, Component } from '../../types/index.js';
import { Request, Response } from 'express';
import { IOfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { fillDTO } from '../../helpers/common.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../libs/rest/error/http-error.js';
import { ParamOfferId } from './types/param-offerid.type.js';
import { ShowOfferRdo } from './rdo/show-offer.rdo.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { ICommentService } from '../comment/comment-service.interface.js';
import { CommentRdo } from '../comment/rdo/comment.rdo.js';
import { ParamCity } from './types/param-city.type.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-router.middleware.js';
import { UserService } from '../user/user-service.interface.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    private readonly offerService: IOfferService,
    @inject(Component.CommentService)
    private readonly commentService: ICommentService,
    @inject(Component.UserService)
    private readonly userService: UserService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
      ],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
      ],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
      ],
    });
    this.addRoute({
      path: '/:id/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
      ],
    });
    this.addRoute({
      path: '/:city/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers,
    });
    this.addRoute({
      path: '/:id/favorite',
      method: HttpMethod.Post,
      handler: this.toggleFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
      ],
    });
    this.addRoute({
      path: '/favorites/by-user',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
  }

  public async index(_req: Request, res: Response) {
    const offers = await this.offerService.find();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    {
      body,
      tokenPayload,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateOfferDto
    >,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({
      ...body,
      author: tokenPayload.id,
    });
    this.created(res, fillDTO(ShowOfferRdo, result));
  }

  public async show(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { id } = params;
    const offer = await this.offerService.findById(id);

    this.ok(res, fillDTO(ShowOfferRdo, offer));
  }

  public async delete(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { id } = params;
    const offer = await this.offerService.deleteById(id);

    this.noContent(res, offer);
  }

  public async update(
    {
      body,
      tokenPayload,
      params,
    }: Request<ParamOfferId, unknown, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const { id } = params;
    const offer = await this.offerService.updateById(id, {
      ...body,
      author: tokenPayload.id,
    });

    this.ok(res, fillDTO(ShowOfferRdo, offer));
  }

  public async getComments(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { id } = params;

    const comments = await this.commentService.findByOfferId(id);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async getPremiumOffers(
    { params }: Request<ParamCity>,
    res: Response
  ): Promise<void> {
    const city = params.city as City;
    if (!Object.values(City).includes(city)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid city',
        'OfferController'
      );
    }
    const offers = await this.offerService.findPremiumByCity(city);
    this.ok(res, fillDTO(ShowOfferRdo, offers));
  }

  public async toggleFavorite(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { id } = params;
    const userId = tokenPayload.id;

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not found',
        'OfferController'
      );
    }

    const favoriteOffers = user.favoriteOffers || [];
    let action: string;

    if (!favoriteOffers.includes(id)) {
      await this.userService.addToFavorites(userId, id);
      this.logger.info(`Offer ${id} added to favorites for user ${userId}`);
      action = 'added';
    } else {
      await this.userService.removeFromFavorites(userId, id);
      this.logger.info(`Offer ${id} removed from favorites for user ${userId}`);
      action = 'removed';
    }

    this.ok(res, { action });
  }

  public async getFavorites(
    { tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const userId = tokenPayload.id;

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not found',
        'OfferController'
      );
    }

    const favoriteIds = user.favoriteOffers || [];
    const favoriteOffers = await this.offerService.findFavoritesByUser(
      favoriteIds
    );

    this.ok(res, fillDTO(ShowOfferRdo, favoriteOffers));
  }
}
