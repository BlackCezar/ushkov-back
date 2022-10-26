import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { join } from 'path';
import { Types } from 'mongoose';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { Public } from '../common/decorators/public.decorator';
import { extname } from 'path';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'documents'),
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Param() p) {
    return file.filename;
  }

  @Post('')
  async createFile(@Body() data) {
    return await this.documentsService.createFile(data);
  }

  @Put(':id')
  async updateFile(@Body() data, @Param('id') id: string) {
    return await this.documentsService.updateFile(id, data);
  }

  @Get('')
  async getFiles(@Query('contractId') contractId: string) {
    return await this.documentsService.getFiles(contractId);
  }

  @Public()
  @Get('download/:filename')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=file.pdf')
  async getFile(@Param() params): Promise<StreamableFile> {
    const path = join(process.cwd(), 'documents', params.filename);

    try {
      if (await stat(path)) {
        const file = createReadStream(path);
        return new StreamableFile(file);
      }
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    await this.documentsService.deleteDocument(id);
  }
}
