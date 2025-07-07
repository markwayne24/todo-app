import { Module } from '@nestjs/common';
import { CronjobsController } from './cronjobs.controller';
import { CronjobsService } from './cronjobs.service';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './tasks/tasks.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
              }
            : undefined,
      },
    }),
    ConfigModule,
    ScheduleModule.forRoot(),
    TaskModule,
  ],
  controllers: [CronjobsController],
  providers: [CronjobsService],
})
export class CronjobsModule {}
