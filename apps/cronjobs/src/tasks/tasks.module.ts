import { Module } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '@/databases/mongo/mongo.module';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { TaskRepository } from '@/common/repositories/tasks/tasks.repository';
import { EmailModule } from '@/common/services/email';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_TASKS } from '@/common/queues/tasks/tasks.constants';

@Module({
  imports: [
    ConfigModule,
    MongoModule,
    EmailModule,
    BullModule.registerQueue(QUEUE_TASKS),
  ],
  providers: [TaskService, TaskRepository, UserRepository],
})
export class TaskModule {}
