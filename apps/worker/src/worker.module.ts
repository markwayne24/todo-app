import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { RedisConfig } from '@/common/config/redis';
import * as basicAuth from 'express-basic-auth';
import { authorizer } from '@/common/helpers/safeAuthorizer';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/tasks.module';
import { UserModule } from './users/users.module';

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot(RedisConfig),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    AuthModule,
    TaskModule,
    UserModule,
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        basicAuth({
          authorizer: authorizer,
          challenge: true,
        }),
      )
      .forRoutes('/queues');
  }
}
