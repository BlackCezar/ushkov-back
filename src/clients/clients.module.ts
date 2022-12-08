import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from '../schemas/Client';
import {Contract, ContractSchema} from "../schemas/Contract";
import {FileSchema, SFile} from "../schemas/SFile";
import {User, UserSchema} from "../schemas/User";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: Contract.name, schema: ContractSchema},
      { name: SFile.name, schema: FileSchema},
      { name: User.name, schema: UserSchema},
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
