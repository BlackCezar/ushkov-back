import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument } from '../schemas/Organization';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private readonly model: Model<OrganizationDocument>,
  ) {}

  async findAll(): Promise<Organization[]> {
    return await this.model.find().populate('users').exec();
  }

  async findOne(id: string): Promise<Organization> {
    return await (await this.model.findById(id).exec()).populate('users');
  }

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const user = await new this.model({
      ...createOrganizationDto,
      createdAt: new Date(),
    }).save();
    return await user.populate('users');
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    console.log(id);
    await this.model.updateOne({ _id: id }, updateOrganizationDto);
    return this.model.findById(id).populate('users');
  }

  async delete(id: string): Promise<Organization> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
