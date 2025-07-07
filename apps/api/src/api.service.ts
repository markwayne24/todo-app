import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  health() {
    return {
      status: 'ok',
      message: 'API is running',
    };
  }
}
