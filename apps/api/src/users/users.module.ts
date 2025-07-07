import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '@/databases/mongo/mongo.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_USERS } from '@/common/queues/users/users.constants';

@Module({
  imports: [ConfigModule, MongoModule, BullModule.registerQueue(QUEUE_USERS)],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
