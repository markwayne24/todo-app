import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  @ApiOperation({
    summary: 'Get API health',
    description: 'Getting the health of the API',
  })
  @Get()
  getApiHealth() {
    return this.apiService.health();
  }
}
