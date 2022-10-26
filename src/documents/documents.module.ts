import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema, SFile } from '../schemas/SFile';

@Module({
  controllers: [DocumentsController],
  imports: [
    MongooseModule.forFeature([{ name: SFile.name, schema: FileSchema }]),
  ],
  providers: [DocumentsService],
})
export class DocumentsModule {}
