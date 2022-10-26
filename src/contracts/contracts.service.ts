import { Injectable } from '@nestjs/common';
import { Contract, ContractDocument } from '../schemas/Contract';
import { CreateContractDto } from '../Contracts/dto/create-Contract.dto';
import { UpdateContractDto } from '../Contracts/dto/update-Contract.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract.name)
    private readonly model: Model<ContractDocument>,
  ) {}

  async findAll(params?: any): Promise<Contract[]> {
    return await this.model.find(params).exec();
  }

  async findOne(id: string): Promise<Contract> {
    return await this.model.findById(id).exec();
  }

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    return await new this.model({
      ...createContractDto,
      createdAt: new Date(),
    }).save();
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
  ): Promise<Contract> {
    return await this.model.findByIdAndUpdate(id, updateContractDto).exec();
  }

  async delete(id: string): Promise<Contract> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
