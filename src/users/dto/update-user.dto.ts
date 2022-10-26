import { BaseUserDto } from './base-user.dto';
import { Role } from '../../common/types/role.enum';
import { ObjectId } from 'mongoose';

export class UpdateUserDto extends BaseUserDto {
  role: Role;
  _id: string | ObjectId;
}
