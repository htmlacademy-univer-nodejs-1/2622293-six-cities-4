import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>>;
  updateById(
    userId: string,
    dto: UpdateUserDto
  ): Promise<DocumentType<UserEntity> | null>;
  updatePassword(
    userId: string,
    dto: UpdatePasswordDto,
    salt: string
  ): Promise<DocumentType<UserEntity> | null>;
  verifyUser(
    dto: LoginUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity> | null>;
  updateUserAvatar(
    userId: string,
    avatarPath: string
  ): Promise<DocumentType<UserEntity> | null>;
  addToFavorites(
    userId: string,
    offerId: string
  ): Promise<DocumentType<UserEntity> | null>;
  removeFromFavorites(
    userId: string,
    offerId: string
  ): Promise<DocumentType<UserEntity> | null>;
}
