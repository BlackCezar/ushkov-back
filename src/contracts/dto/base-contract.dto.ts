import { SFile } from '../../schemas/SFile';
import { ContractStatus } from '../../schemas/Contract';

export class BaseContractDto {
  name: string;
  number: string;
  startDate: Date | string;
  endDate: Date | string;
  status: ContractStatus;
  amount: number;
  documents: SFile[];
}
