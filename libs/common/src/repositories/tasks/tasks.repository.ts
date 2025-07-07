import { Injectable } from '@nestjs/common';
import { MongoDBService } from '@/databases/mongo/mongo.service';
import { Task } from '@/common/entities/tasks/tasks.entity';
import { AbstractRepository } from '@/common/abstracts/AbstractRepository';

/**
 * Repository to work with database.
 */
@Injectable()
export class TaskRepository extends AbstractRepository<Task> {
  constructor(_mongo: MongoDBService) {
    super(_mongo, 'tasks');
  }
}
