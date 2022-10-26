import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { UsersService } from './users.service';
import { Public } from '../common/decorators/public.decorator';
import { SigninDto } from './dto/signin.dto';
import { Tokens } from '../common/types/tokens.type';
import { CreateUserDto } from './dto/create-user';
import { User } from '../schemas/User';
import { RtGard } from '../common/gards/rt.gard';
import { AdminOnly } from '../common/decorators/admin-onlu.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('')
  async users(@AdminOnly() permission: any): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Get('/me')
  async getMyUser(@GetCurrentUserId() userId: string) {
    return await this.userService.findById(userId);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SigninDto): Promise<Tokens> {
    return await this.userService.signIn(signInDto);
  }

  @Public()
  @UseGuards(RtGard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@GetCurrentUserId() userId: string) {
    console.log('Refresh');
    return this.userService.refreshTokens(userId);
  }

  @Post('')
  async addUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Put(':id')
  async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string): Promise<string> {
    await this.userService.delete(userId);
    return userId;
  }
}
