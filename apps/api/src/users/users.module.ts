import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from '@/databases/mongo/mongo.module';

@Module({
  imports: [ConfigModule, MongoModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
