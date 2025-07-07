import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { TaskRepository } from '@/repositories/tasks/tasks.repository';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '@/databases/mongo/mongo.module';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { EmailModule } from '@/common/services/email';
import { QUEUE_TASKS } from '@/common/queues/tasks/tasks.constants';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule,
    MongoModule,
    EmailModule,
    BullModule.registerQueue(QUEUE_TASKS),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, UserRepository],
  exports: [TaskService],
})
export class TaskModule {}
