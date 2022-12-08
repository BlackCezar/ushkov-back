import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import {ContractStatus} from "../schemas/Contract";

@Controller('contracts')
export class ContractsController {
  constructor(private contractsService: ContractsService) {}

  @Get('/export')
  async exportTable(@Query('id') id: string) {
      return await this.contractsService.exportExcel(id)
  }

  @Get()
  async index(@Query('organization') organization?: string, @Query('status') status?: string) {
    const params: any = {};
    if (organization) params.organization = organization; else return [];
    params.status = status ? parseInt(status) : {$ne: ContractStatus.Archived}

    return await this.contractsService.findAll(params);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.contractsService.findOne(id);
  }

  @Post()
  async create(@Body() createContractDto: CreateContractDto) {
    return await this.contractsService.create(createContractDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return await this.contractsService.update(id, updateContractDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.contractsService.delete(id);
  }
}
