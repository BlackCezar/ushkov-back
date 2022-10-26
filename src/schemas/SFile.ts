import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum FileTypes {
  Contract = 'Contract',
  Transfer = 'Transfer',
  Closure = 'Closure',
  Bill = 'Bill',
  Claim = 'Claim',
  AdditAgreement = 'AdditAgreement',
}

// Transfer, Closure, Bill;

export type FileDocument = SFile & Document;

@Schema()
export class SFile {
  @Prop()
  filename: string;
  @Prop()
  type: FileTypes;
  @Prop()
  amount: number;
  @Prop()
  number: string;
  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;
  @Prop()
  comment: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' })
  contract: string;
}

export const FileSchema = SchemaFactory.createForClass(SFile);
