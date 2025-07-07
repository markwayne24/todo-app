import { Injectable } from '@nestjs/common';
import { MongoDBService } from '@/databases/mongo/mongo.service';
import { AbstractRepository } from '@/common/abstracts/AbstractRepository';
import { User } from '@/common/entities/users/users.entity';

/**
 * Repository to work with database.
 */

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(_mongo: MongoDBService) {
    super(_mongo, 'users');
  }
}
