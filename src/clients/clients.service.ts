import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateClientDto} from './dto/create-client.dto';
import {UpdateClientDto} from './dto/update-client.dto';
import * as ExcelJS from 'exceljs';
import {Contract, ContractDocument} from "../schemas/Contract";
import {FileDocument, SFile} from "../schemas/SFile";
import {join} from "path";
import {Client, ClientDocument} from "../schemas/Client";
import {User, UserDocument} from "../schemas/User";
import {HashService} from "../helpers/hash.service";
import {Role} from "../common/types/role.enum";

enum ContractStatus {
  'В работе',
  'Успешно',
  'Ошибка',
}

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name)
    private readonly model: Model<ClientDocument>,
    @InjectModel(Contract.name)
    private readonly contracts: Model<ContractDocument>,
    @InjectModel(SFile.name)
    private readonly docs: Model<FileDocument>,
  @InjectModel(User.name)
  private readonly users: Model<UserDocument>,
    private hashService: HashService,
  ) {}

  async exportTable(id: string) {
    const organization = await this.model.findById(id).lean()
    const contracts = await this.contracts.find({organization: organization._id}).lean()
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
    sheet.mergeCells('A1:H1')
    const nameCell = sheet.getCell('A1')
    nameCell.value = organization.name
    sheet.getRow(1).height = 40

    const cols = [
      {header: 'Номер контракта (договора)', key: 'number', width: 15},
      {header: 'Наименование контракта (договора )', key: 'name', width: 50},
      {header: 'Дата начала исполнения', key: 'startDate', width: 14},
      {header: 'Дата окончания исполнения', key: 'endDate', width: 14},
      {header: 'Сумма контракта / договора', key: 'amount', width: 15},
      {header: 'СМП', key: 'NSR', width: 15},
      {header: 'ИНН', key: 'TIN', width: 15},
      {header: 'Закон', key: 'type', width: 15},
    ]
    const rows = []
    sheet.addRow(cols.map(col => col.header), 'n')
    const headerRow =sheet.getRow(2)

    for (const contract of contracts) {
      let type = ''
      if (contract.type === '223') type = '223-ФЗ';
      else if (contract.type === '44.4') type = 'п.4 - 44-ФЗ';
      else if (contract.type === '44.5') type = 'п.5 - 44-ФЗ'

      rows.push([
          contract.number,
          contract.name,
          contract.startDate,
          contract.endDate,
          contract.amount,
          contract.NSR ? 'Да' : 'Нет',
          contract.TIN,
          type
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

      if (['amount'].indexOf(cols[i].key) !== -1) {
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

  async findAll(): Promise<Client[]> {
    return this.model.find().populate('user').populate('users').lean();
  }

  async findOne(id: string): Promise<Client> {
    return this.model.findOne({user: id}).lean().populate('user').populate('users')
  }

  async create(
    createClientDto: CreateClientDto,
  ): Promise<Client> {
    const password = await this.hashService.hash(createClientDto.user.password)
    const user = await this.users.create({
      password,
      name: createClientDto.name,
      email: createClientDto.user.email,
      role: Role.CLIENT
    })
    console.log('Create user', user)
    console.log(createClientDto)
    const client = await new this.model({
      name: createClientDto.name,
      law: createClientDto.law,
      createdAt: new Date(),
      user: user._id
    }).save();
    return await client.populate('user');
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    console.log(updateClientDto.user);
    // @ts-ignore
    await this.users.updateOne({_id: updateClientDto.user._id}, {
      email: updateClientDto.user.email,
      name: updateClientDto.user.name,
    })
    await this.model.updateOne({ _id: id }, updateClientDto);
    return this.model.findById(id).populate('user').populate('users').lean();
  }

  async delete(id: string): Promise<Client> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
