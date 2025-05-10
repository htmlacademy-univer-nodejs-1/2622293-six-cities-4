import { DocumentType } from '@typegoose/typegoose';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Component } from '../../types/component.enum.js';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';

@injectable()
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

  public async findById(
    userId: string
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findById(userId)
      .lean() as Promise<DocumentType<UserEntity> | null>;
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

  public async updateById(
    userId: string,
    dto: UpdateUserDto
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .exec() as Promise<DocumentType<UserEntity> | null>;
  }

  public async updatePassword(
    userId: string,
    dto: UpdatePasswordDto,
    salt: string
  ): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findById(userId);

    if (!user) {
      return null;
    }

    if (user.verifyPassword(dto.oldPassword, salt)) {
      user.setPassword(dto.newPassword, salt);
      return user.save() as Promise<DocumentType<UserEntity>>;
    }

    return null;
  }

  public async verifyUser(
    dto: LoginUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  public async updateUserAvatar(
    userId: string,
    avatarPath: string
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { avatar: avatarPath }, { new: true })
      .lean()
      .exec() as Promise<DocumentType<UserEntity> | null>;
  }
}
