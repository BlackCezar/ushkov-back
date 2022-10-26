import { SFile } from '../../schemas/SFile';
import { ContractStatus } from '../../schemas/Contract';

export class BaseContractDto {
  name: string;
  number: string;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;
  amount: number;
  documents: SFile[];
}
