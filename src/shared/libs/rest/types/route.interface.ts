import { NextFunction, Response, Request } from 'express';
import { HttpMethod } from './http-method.enum.js';
import { Middleware } from '../middleware/middleware.interface.js';

export interface IRoute {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
}
