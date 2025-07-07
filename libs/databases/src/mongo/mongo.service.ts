import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';

/**
 * Service to manage MongoDB connections for multiple databases.
 */
@Injectable()
export class MongoDBService extends MongoClient implements OnModuleInit {
  private connectionString: string;

  constructor(private readonly configService: ConfigService) {
    const uri = configService.get<string>('MONGODB_URI', '');
    super(uri);
    this.connectionString = uri;
  }

  async onModuleInit() {
    await this.connect();

    // Ensure indexes and other initialization tasks can be done here
    // This is a good place to initialize both databases if needed
  }

  /**
   * Get a database instance by name
   * @param databaseName The name of the database to connect to
   * @returns The database instance
   */
  db(databaseName: string = 'to-do') {
    return super.db(databaseName);
  }

  async enableShutdownHooks(app: INestApplication) {
    this.on('close', async () => {
      await app.close();
    });
  }
}
