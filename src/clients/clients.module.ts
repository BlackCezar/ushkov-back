import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from '../schemas/Organization';
import {Contract, ContractSchema} from "../schemas/Contract";
import {FileSchema, SFile} from "../schemas/SFile";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: Contract.name, schema: ContractSchema},
      { name: SFile.name, schema: FileSchema},
    ]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}
