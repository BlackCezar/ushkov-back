import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashService {
  async hash(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async compare(s1: string, s2: any) {
    return await bcrypt.compare(s1, s2);
  }
}
