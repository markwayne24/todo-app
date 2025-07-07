import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { AuthProcessConsumer } from './auth.process';
import { EmailModule } from '@/common/services/email';
import { QUEUE_AUTH } from '@/common/queues/auth/auth.constants';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { MongoModule } from '@/databases/mongo/mongo.module';
import { AuthHandlerService } from './auth.handler';

@Module({
  providers: [AuthProcessConsumer, UserRepository, AuthHandlerService],
  imports: [
    ConfigModule,
    EmailModule,
    MongoModule,
    BullModule.registerQueue(QUEUE_AUTH),
    BullBoardModule.forFeature({
      name: QUEUE_AUTH.name,
      adapter: BullMQAdapter,
    }),
  ],
  exports: [AuthProcessConsumer, AuthHandlerService],
})
export class AuthModule {}
