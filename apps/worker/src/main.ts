import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);
  const configService = app.get(ConfigService);
  app.useLogger(app.get(Logger));
  const port = configService.get<string>('WORKER_PORT', '3003');
  await app.listen(port, () => console.log(`Worker listening on port ${port}`));
}
bootstrap();
