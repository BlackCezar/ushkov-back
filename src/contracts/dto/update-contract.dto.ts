import { BaseContractDto } from './base-contract.dto';

export class UpdateContractDto extends BaseContractDto {
    filename?: string;
    _id: string;
}
