import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';

export class UploadFileMiddleware implements Middleware {
  constructor(private uploadDirectory: string, private fieldName: string) {}

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const fileName = nanoid();
        callback(null, `${fileName}.${fileExtension}`);
      },
    });

    const uploadSingleFileMiddleware = multer({ storage }).single(
      this.fieldName
    );

    uploadSingleFileMiddleware(req, res, next);
  }
}
