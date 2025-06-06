import { inject, injectable } from 'inversify';
import * as crypto from 'node:crypto';
import { AuthService } from './auth-service.interface.js';
import { UserService } from '../user/user-service.interface.js';
import { Config } from 'convict';
import { RestSchema } from '../../libs/index.js';
import { Component } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';
import { TokenPayload } from './types/TokenPayload.js';
import { SignJWT } from 'jose';
import { JWT_ALGORITHM, JWT_EXPIRED } from './auth.constant.js';
import { LoginUserDto } from '../user/dto/login-user.dto.js';
import { Logger } from 'pino';
import { UserNotFoundException } from './errors/user-not-found.exception.js';
import { UserPasswordINcorrectException } from './errors/user-password-incorrect.exception.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password ${dto.email}`);
      throw new UserPasswordINcorrectException();
    }

    return user;
  }
}
