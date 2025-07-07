import { NestFactory } from '@nestjs/core';
import { CronjobsModule } from './cronjobs.module';

async function bootstrap() {
  const app = await NestFactory.create(CronjobsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
