import { TokenPayload } from './src/shared/modules/auth/types/TokenPayload.ts';

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPayload: TokenPayload;
  }
}
