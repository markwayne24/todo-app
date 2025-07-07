import { Controller, Get } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';

@Controller()
export class CronjobsController {
  constructor(private readonly cronjobsService: CronjobsService) {}

  @Get()
  getHello(): string {
    return this.cronjobsService.getHello();
  }
}
