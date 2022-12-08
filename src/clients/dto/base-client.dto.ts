import { User } from '../../schemas/User';

export class BaseClientDto {
  name: string;
  user: User;
  law: string;
}
