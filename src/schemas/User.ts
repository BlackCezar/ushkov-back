import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../common/types/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  name: string;
  @Prop()
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
