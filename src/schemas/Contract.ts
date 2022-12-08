import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SFile } from './SFile';
import mongoose, { Document } from 'mongoose';

export enum ContractStatus {
  Active,
  Success,
  Fail,
  Archived
}

export type ContractDocument = Contract & Document;

@Schema()
export class Contract {
  @Prop()
  name: string;
  @Prop()
  number: string;
  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;
  @Prop({index: true, enum: ContractStatus, type: Number})
  status: ContractStatus;
  @Prop()
  amount: number;
  @Prop()
  type: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organizations' })
  organization: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SFile' }] })
  documents: SFile[];
  @Prop()
  TIN: string;
  @Prop({type: Boolean, default: false})
  NSR: boolean;
  @Prop({type: String, required: false})
  comment?: string;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
