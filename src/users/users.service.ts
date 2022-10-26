import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/User';
import { Model } from 'mongoose';
import { SigninDto } from './dto/signin.dto';
import { Tokens } from '../common/types/tokens.type';
import { Role } from '../common/types/role.enum';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../helpers/hash.service';
import { CreateUserDto } from './dto/create-user';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async user(where): Promise<UserDocument | null> {
    return this.model.findOne(where).exec();
  }

  async delete(userId: string) {
    await this.model.findByIdAndDelete(userId);
  }

  async update(updateUserDto: UpdateUserDto) {
    return this.model.findByIdAndUpdate(updateUserDto._id, {
      name: updateUserDto.name,
      email: updateUserDto.email,
      role: updateUserDto.role,
    });
  }

  async getUsers(where?): Promise<UserDocument[] | null> {
    return this.model.find(where).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await this.hashService.hash(createUserDto.password);

    return await new this.model({
      ...createUserDto,
      password,
    }).save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.model.findById(id).exec();
  }

  async signIn(signinDto: SigninDto) {
    const user: UserDocument = await this.user({ email: signinDto.email });
    if (!user) throw new ForbiddenException('Неверный логин');

    const passwordMatches = await this.hashService.compare(
      signinDto.password,
      user.password,
    );
    if (!passwordMatches) throw new ForbiddenException('Неверный пароль');
    return await this.getTokens(user._id, user.email, Role[user.role]);
  }

  async refreshTokens(userId: string): Promise<Tokens> {
    const user = await this.findById(userId);

    if (!user) throw new ForbiddenException('Нет доступа');

    return await this.getTokens(user.id, user.email, Role[user.role]);
  }

  async getTokens(userId: string, email: string, role: Role): Promise<Tokens> {
    const payload = { sub: userId, email, role };
    const [at, rt] = await Promise.all([
      this.generateToken(
        payload,
        process.env.AT_SECRET,
        process.env.AT_EXPIRES_IN,
      ),
      this.generateToken(
        payload,
        process.env.RT_SECRET,
        process.env.RT_EXPIRES_IN,
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async generateToken(payload: any, secret: string, expiresIn: string) {
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }
}
