import { UserType } from '../../../types/user.js';

export class UpdateUserDto {
  public name?: string;
  public email?: string;
  public avatar?: string;
  public userType?: UserType;
}
