import { Module } from '@nestjs/common';
import { CronjobsController } from './cronjobs.controller';
import { CronjobsService } from './cronjobs.service';

@Module({
  imports: [],
  controllers: [CronjobsController],
  providers: [CronjobsService],
})
export class CronjobsModule {}
