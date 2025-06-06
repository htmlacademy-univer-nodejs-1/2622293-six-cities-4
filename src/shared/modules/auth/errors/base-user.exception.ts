import { HttpError } from '../../../libs/rest/error/http-error.js';

export class BaseUserException extends HttpError {
  constructor(httpStatusCode: number, message: string) {
    super(httpStatusCode, message);
  }
}
