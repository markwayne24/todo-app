import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { TaskRepository } from '@/repositories/tasks/tasks.repository';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '@/databases/mongo/mongo.module';
import { UserRepository } from '@/common/repositories/users/users.repository';

@Module({
  imports: [ConfigModule, MongoModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, UserRepository],
  exports: [TaskService],
})
export class TaskModule {}
