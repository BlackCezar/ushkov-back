import { Module } from '@nestjs/common';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from '../schemas/Contract';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Contract.name,
        schema: ContractSchema,
      },
    ]),
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
