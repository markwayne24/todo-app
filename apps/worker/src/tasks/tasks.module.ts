import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { TaskProcessConsumer } from './tasks.process';
import { EmailModule } from '@/common/services/email';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { TaskRepository } from '@/common/repositories/tasks/tasks.repository';
import { MongoModule } from '@/databases/mongo/mongo.module';
import { TaskHandlerService } from './tasks.handler';
import { QUEUE_TASKS } from '@/common/queues/tasks/tasks.constants';

@Module({
  providers: [
    TaskProcessConsumer,
    UserRepository,
    TaskRepository,
    TaskHandlerService,
  ],
  imports: [
    ConfigModule,
    EmailModule,
    MongoModule,
    BullModule.registerQueue(QUEUE_TASKS),
    BullBoardModule.forFeature({
      name: QUEUE_TASKS.name,
      adapter: BullMQAdapter,
    }),
  ],
  exports: [TaskProcessConsumer, TaskHandlerService],
})
export class TaskModule {}
