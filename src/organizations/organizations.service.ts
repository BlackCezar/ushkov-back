import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument } from '../schemas/Organization';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import * as ExcelJS from 'exceljs';
import {Contract, ContractDocument} from "../schemas/Contract";
import {FileDocument, SFile} from "../schemas/SFile";
import {join} from "path";

enum ContractStatus {
  'В работе',
  'Успешно',
  'Ошибка',
  'Архив'
}

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private readonly model: Model<OrganizationDocument>,
    @InjectModel(Contract.name)
    private readonly contracts: Model<ContractDocument>,
    @InjectModel(SFile.name)
    private readonly docs: Model<FileDocument>
  ) {}

  async exportTable(id: string) {
    const organization = await this.model.findById(id)
    const contracts = await this.contracts.find({organization: organization._id, status: {$ne: 3}}).lean()
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'АСУЗД'
    workbook.created = new Date()
    const sheet = workbook.addWorksheet('Контракты')
    sheet.state = 'visible'

    const style = {
      font: {
        name: 'Times New Roman',
        size: 12
      },
      margins: {
        insetmode: 'custom',
        inset: [0.25, 0.25, 0.35, 0.35]
      },
      alignment: {
        wrapText: true,
        vertical: 'middle',
        indent: 2
      },
      border: {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      }
    }
    sheet.mergeCells('A1:L1')
    const nameCell = sheet.getCell('A1')
    nameCell.value = organization.name
    sheet.getRow(1).height = 40

    const cols = [
      {header: 'Номер контракта (договора)', key: 'number', width: 15},
      {header: 'Наименование контракта (договора )', key: 'name', width: 50},
      {header: 'Дата начала исполнения', key: 'startDate', width: 14},
      {header: 'Дата окончания исполнения', key: 'endDate', width: 14},
      {header: 'Статус', key: 'status', width: 30},
      {header: 'Сумма контракта / договора', key: 'amount', width: 15},
      {header: 'Сумма платежных поручений', key: 'billAmount', width: 15},
      {header: 'Сумма актов выполненных работ', key: 'actsAmount', width: 15},
      {header: 'Сумма УПД', key: 'updAmount', width: 15},
      {header: 'Претензии (есть/нет)', key: 'hasClaim', width: 13},
      {header: 'Расторжения (есть/нет)', key: 'hasTerminations', width: 13},
      {header: 'Доп соглашения (есть/нет)', key: 'hasAdditAgreement', width: 13},
    ]
    const rows = []
    sheet.addRow(cols.map(col => col.header), 'n')
    const headerRow =sheet.getRow(2)

    for (const contract of contracts) {
      const docs = await this.docs.find({contract: contract._id})
      const hasAdditAgreement = docs.find(d => d.type === 'AdditAgreement')
      // @ts-ignore
      const hasTerminations = docs.find(d => d.type === 'Terminations')
      const hasClaim = docs.find(d => d.type === 'Claim')
      const updAmount = docs.filter(d => d.type === 'Transfer').reduce((acc, doc) => acc += doc.amount, 0.0)
      const actsAmount = docs.filter(d => d.type === 'Closure').reduce((acc, doc) => acc += doc.amount, 0.0)
      const billAmount = docs.filter(d => d.type === 'Bill').reduce((acc, doc) => acc += doc.amount, 0.0)
      rows.push([
          contract.number,
          contract.name,
          contract.startDate,
          contract.endDate,
          ContractStatus[contract.status],
          contract.amount,
          billAmount, actsAmount, updAmount,
          hasClaim ? 'Есть' : 'Нет',
          hasTerminations ? 'Есть' : 'Нет',
          hasAdditAgreement ? 'Есть' : 'Нет'
      ])
    }
    sheet.addRows(rows)

    for (let i = 0; i < cols.length; i++) {
      const column = sheet.getColumn(i + 1)

      column.font = style.font
      column.key = cols[i].key
      column.width = cols[i].width
      // @ts-ignore
      column.border =style.border
      // @ts-ignore
      column.alignment = style.alignment

      if (['amount', 'billAmount', 'actsAmount', 'updAmount'].indexOf(cols[i].key) !== -1) {
        column.numFmt =  '# ##0,00" ₽"'
      }

      if (headerRow.getCell(i + 1)) {
        headerRow.getCell(i + 1).font = {
          ...style.font,
          bold: true
        }
        headerRow.getCell(i + 1).alignment = {
          wrapText: true,
          horizontal: 'center',
          vertical: 'middle'
        }
      }
    }
    nameCell.font = {...style.font, bold: true}
    nameCell.alignment = {

      horizontal: 'center',
      vertical: 'middle'
    }
    const filename = 'organization.xlsx'
    await workbook.xlsx.writeFile(join(process.cwd(), 'documents', 'export',filename))
    return {filename}
  }

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
