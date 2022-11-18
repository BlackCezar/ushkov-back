import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Command } from 'nestjs-command';
import { Role } from '../common/types/role.enum';
import { HashService } from '../helpers/hash.service';

@Injectable()
export class UserSeed {
  constructor(
    private readonly userService: UsersService,
    private hashService: HashService,
  ) {}
  @Command({
    command: 'create:user',
    describe: 'create a admin user',
  })
  async create() {
    console.log('Create', process.env.ADMIN_PASS);
    const password = await this.hashService.hash(process.env.ADMIN_PASS);
    const user = await this.userService.create({
      email: process.env.ADMIN_LOGIN,
      password,
      role: Role.ADMIN,
      name: 'Администратор',
    });
    console.log(user);
  }
}
