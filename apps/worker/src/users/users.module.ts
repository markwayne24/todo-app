import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { EmailModule } from '@/common/services/email';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { MongoModule } from '@/databases/mongo/mongo.module';
import { QUEUE_USERS } from '@/common/queues/users/users.constants';
import { UserProcessConsumer } from './users.process';
import { UserHandlerService } from './users.handler';

@Module({
  providers: [UserProcessConsumer, UserRepository, UserHandlerService],
  imports: [
    ConfigModule,
    EmailModule,
    MongoModule,
    BullModule.registerQueue(QUEUE_USERS),
    BullBoardModule.forFeature({
      name: QUEUE_USERS.name,
      adapter: BullMQAdapter,
    }),
  ],
  exports: [UserProcessConsumer, UserHandlerService],
})
export class UserModule {}
