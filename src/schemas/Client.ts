import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './User';

export type ClientDocument = Client & Document;

@Schema()
export class Client {
  @Prop()
  name: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop()
  law: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
