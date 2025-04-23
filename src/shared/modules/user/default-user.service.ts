import { DocumentType } from '@typegoose/typegoose';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Component } from '../../types/component.enum.js';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { inject } from 'inversify';
import { Logger } from 'pino';

export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel)
    private readonly userModel: ModelType<UserEntity>
  ) {}

  public async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);
    return result as DocumentType<UserEntity>;
  }

  public async findByEmail(
    email: string
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = await this.findByEmail(dto.email);
    if (user) {
      return user;
    }
    return this.create(dto, salt);
  }
}
