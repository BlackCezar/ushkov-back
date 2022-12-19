import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema, SFile } from '../schemas/SFile';
import {Client, ClientSchema} from "../schemas/Client";

@Module({
  controllers: [DocumentsController],
  imports: [
    MongooseModule.forFeature([{ name: SFile.name, schema: FileSchema }, {name: Client.name, schema: ClientSchema}]),
  ],
  providers: [DocumentsService],
})
export class DocumentsModule {}
