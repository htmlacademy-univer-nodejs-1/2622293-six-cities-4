import { Request, Response, NextFunction } from 'express';

export interface ExceptionFilter {
  catch(error: unknown, req: Request, res: Response, next: NextFunction): void;
}
