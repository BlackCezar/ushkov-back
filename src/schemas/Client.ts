import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './User';
import { Contract } from './Contract';

export type OrganizationDocument = Organization & Document;

@Schema()
export class Organization {
  @Prop()
  name: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }] })
  contracts: Contract[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
