import { Request } from 'express';
import { RequestParams } from '../../../libs/rest/types/request.params.type.js';
import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { RequestBody } from '../../../libs/rest/types/request-body.types.js';

export type CreateCommentRequest = Request<
  RequestParams,
  RequestBody,
  CreateCommentDto
>;
