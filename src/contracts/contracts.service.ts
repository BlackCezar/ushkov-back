import {Injectable} from '@nestjs/common';
import {Contract, ContractDocument} from '../schemas/Contract';
import {CreateContractDto} from '../contracts/dto/create-contract.dto';
import {UpdateContractDto} from '../contracts/dto/update-contract.dto';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import * as ExcelJS from "exceljs";
import {Organization, OrganizationDocument} from "../schemas/Organization";
import {FileDocument, FileTypes, SFile} from "../schemas/SFile";
import {join} from "path";

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract.name)
    private readonly model: Model<ContractDocument>,
    @InjectModel(SFile.name)
    private readonly docs: Model<FileDocument>,
    @InjectModel(Organization.name)
    private readonly organization: Model<OrganizationDocument>,
  ) {}

    async exportExcel(id: string) {
      const contract = await this.model.findById(id).lean()
      const organization = await this.organization.findById(contract.organization).lean()
      const docs = await this.docs.find({contract: contract._id}).lean()
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'АСУЗД'
      workbook.created = new Date()
      const sheet = workbook.addWorksheet(contract.name)
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

      this.setOrganizationNumber(sheet, organization, style)
      this.setContractName(sheet, contract, style)
      this.setContractNumber(sheet, contract, style)

      this.addTransferTable(sheet, docs, style)
      this.addBillsTable(sheet, docs, style)
      this.addEmptyCells(sheet,style)

      const filename = contract.name + '.xlsx'
      await workbook.xlsx.writeFile(join(process.cwd(), 'documents', 'export',filename))
      return {filename}
    }

  addEmptyCells(sheet, style) {
    sheet.getCell('A8').border = style.border
    sheet.getCell('B8').border = style.border
    sheet.getCell('C8').border = style.border
    sheet.getCell('E8').border = style.border
    sheet.getCell('F8').border = style.border
    sheet.getCell('G8').border = style.border
  }
  addTransferTable(sheet, docs, style) {
    sheet.mergeCells('A7:C7')
    const UPDCell = sheet.getCell('A7')
    const NumberCell = sheet.getCell('A9')
    const AmountCell = sheet.getCell('B9')
    const DateCell = sheet.getCell('C9')
    NumberCell.value = 'Номер документа'
    NumberCell.font = {
      ...style.font,
      bold: true
    }
    NumberCell.border = style.border
    AmountCell.value = 'Сумма'
    AmountCell.font = {
      ...style.font,
      bold: true
    }
    AmountCell.border = style.border
    DateCell.value = 'Дата документа'
    DateCell.font = {
      ...style.font,
      bold: true
    }
    DateCell.border = style.border
    UPDCell.value = 'УПД'
    UPDCell.font = {
      ...style.font,
      bold: true
    }
    UPDCell.border = style.border
    const transfers = docs.filter(doc => doc.type === 'Transfer')
    this.fillTable(sheet, style, transfers, ['A', 'B', 'C'])
  }
  addBillsTable(sheet, docs, style) {
    sheet.mergeCells('E7:G7')
    const UPDCell = sheet.getCell('E7')
    const NumberCell = sheet.getCell('E9')
    const AmountCell = sheet.getCell('F9')
    const DateCell = sheet.getCell('G9')
    NumberCell.value = 'Номер документа'
    NumberCell.font = {
      ...style.font,
      bold: true
    }
    NumberCell.border = style.border
    AmountCell.value = 'Сумма'
    AmountCell.font = {
      ...style.font,
      bold: true
    }
    AmountCell.border = style.border
    DateCell.value = 'Дата документа'
    DateCell.font = {
      ...style.font,
      bold: true
    }
    DateCell.border = style.border
    UPDCell.value = 'Платежные поручения'
    UPDCell.font = {
      ...style.font,
      bold: true
    }
    UPDCell.border = style.border
    const bills = docs.filter(doc => doc.type === 'Bill')
    this.fillTable(sheet, style, bills, ['E', 'F', 'G'])
  }

  fillTable(sheet, style, list, cols) {
    let rowCount = 10
    for (const item of list) {
      const numberCell = sheet.getCell(cols[0] + rowCount)
      const amountCell = sheet.getCell(cols[1] + rowCount)
      const dateCell = sheet.getCell(cols[2] + rowCount)
      numberCell.value = item.number
      amountCell.value = item.amount
      amountCell.numFmt = '# ##0,00" ₽"'
      dateCell.value = item.startDate
      numberCell.border = style.border
      numberCell.font = style.font
      amountCell.border = style.border
      amountCell.font = style.font
      dateCell.border = style.border
      dateCell.font = style.font
      rowCount++
    }
  }

  setOrganizationNumber(sheet, organization, style) {
    sheet.getColumn(1).width = 30
    sheet.getColumn(2).width = 15
    sheet.getColumn(3).width = 20
    sheet.getColumn(5).width = 30
    sheet.getColumn(6).width = 15
    sheet.getColumn(7).width = 20

    sheet.getCell('A1').value = 'Номер учреждения'
    sheet.getCell('A1').font = {
      ...style.font,
      bold: true
    }
    sheet.getCell('B1').value = organization.name
  }
  setContractName(sheet, contract, style) {
    sheet.getCell('A3').value = 'Наименование контракта'
    sheet.getCell('A3').font = {
      ...style.font,
      bold: true
    }
    sheet.getCell('B3').value = contract.name
  }
  setContractNumber(sheet, contract, style) {
    sheet.getCell('A5').value = 'Номер контракта'
    sheet.getCell('A5').font = {
      ...style.font,
      bold: true
    }
    sheet.getCell('B5').value = contract.number
  }

  async findAll(params?: any): Promise<Contract[]> {
    return this.model.find(params).lean().populate('documents');
  }

  async findOne(id: string): Promise<Contract> {
    return this.model.findById(id).lean();
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
    console.dir(updateContractDto);
    if (updateContractDto.filename) {
      const doc = await this.docs.create({
        filename:updateContractDto.filename,
        type: FileTypes.Contract,
        contract: updateContractDto._id
      })
      if (updateContractDto.documents) updateContractDto.documents.push(doc._id); else {
        updateContractDto.documents = [doc._id];
      }
    }
    return this.model.findByIdAndUpdate(id, updateContractDto).lean();
  }

  async delete(id: string): Promise<Contract> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
