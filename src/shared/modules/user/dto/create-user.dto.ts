import { UserType } from '../../../types/user.js';

export class CreateUserDto {
  public email: string;
  public name: string;
  public password: string;
  public avatar: string;
  public userType: UserType;
}
