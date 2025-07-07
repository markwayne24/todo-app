import { Module } from '@nestjs/common';
import { MongoDBService } from './mongo.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MongoDBService],
  exports: [MongoDBService],
})
export class MongoModule {}
