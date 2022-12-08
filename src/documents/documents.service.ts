import { Injectable } from '@nestjs/common';
import {stat, unlink} from 'fs/promises';
import { join } from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { FileDocument, SFile } from '../schemas/SFile';
import { Model, Schema, Types } from 'mongoose';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(SFile.name) private model: Model<FileDocument>) {}

  async deleteDocument(id: string) {
    try {
      const file = await this.model.findByIdAndDelete(id);
      let link = join(process.cwd(), 'documents', file.filename)
      if (file.filename)
        await unlink(link);
    } catch (err: any) {
      if (err.kind === 'ObjectId') {
        let link = join(process.cwd(), 'documents', id)
        const file = await this.model.findOneAndRemove({filename: id})
        if (file && file.filename) await unlink(link); else {
          if (await stat(link)) await unlink(link)
        }
      } else console.log(err)
    }
  }

  async updateFile(fileId: string, data) {
    const id = new Types.ObjectId(data._id);
    console.log(id);
    console.log(data._id);
    await this.model.updateOne(
      { _id: id },
      {
        $set: {
          number: data.number,
          amount: data.amount,
          type: data.type,
          contract: data.contract,
          endDate: data.endDate,
          startDate: data.startDate,
          filename: data.filename,
          comment: data.comment,
        },
      },
    );
    return this.model.findOne({ _id: id });
  }

  async getFiles(contractId: string) {
    const id = new Types.ObjectId(contractId);
    console.log(id, contractId);
    return this.model.find({ contract: id });
  }

  async createFile(data): Promise<FileDocument> {
    return await new this.model(data).save();
  }
}
