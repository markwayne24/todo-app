import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { TaskModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisConfig } from '@/common/config/redis';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { authorizer } from '@/common/helpers/safeAuthorizer';
import * as basicAuth from 'express-basic-auth';

@Module({
  imports: [
    ConfigModule,
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
    BullModule.forRoot(RedisConfig),
    UserModule,
    AuthModule,
    TaskModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule implements NestModule {
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
