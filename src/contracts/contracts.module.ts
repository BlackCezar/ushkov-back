import { Module } from '@nestjs/common';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from '../schemas/Contract';
import {FileSchema, SFile} from "../schemas/SFile";
import {Organization, OrganizationSchema} from "../schemas/Organization";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Contract.name,
        schema: ContractSchema,
      },
      {
        name: SFile.name,
        schema: FileSchema,
      },
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
    ]),
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
