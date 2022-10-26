import { BaseUserDto } from './base-user.dto';
import { Role } from '../../common/types/role.enum';

export class CreateUserDto extends BaseUserDto {
  role: Role;
}
