import { Module } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '@/databases/mongo/mongo.module';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { TaskRepository } from '@/common/repositories/tasks/tasks.repository';
import { EmailModule } from '@/common/services/email';

@Module({
  imports: [ConfigModule, MongoModule, EmailModule],
  providers: [TaskService, TaskRepository, UserRepository],
})
export class TaskModule {}
