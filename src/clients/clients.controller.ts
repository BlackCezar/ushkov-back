import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get(':id/export')
  async exportOrganization(@Param('id') id: string) {
    return await this.clientsService.exportTable(id)
  }

  @Get()
  async index() {
    return await this.clientsService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.clientsService.findOne(id);
  }

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientsService.create(createClientDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return await this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.clientsService.delete(id);
  }
}
