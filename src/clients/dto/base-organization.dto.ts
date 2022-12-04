import { User } from '../../schemas/User';
import { Contract } from '../../schemas/Contract';

export class BaseOrganizationDto {
  name: string;
  users: User[];
  contracts: Contract[];
}
