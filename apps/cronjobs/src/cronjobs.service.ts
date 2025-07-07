import { Injectable } from '@nestjs/common';

@Injectable()
export class CronjobsService {
  getHello(): string {
    return 'Hello World!';
  }
}
