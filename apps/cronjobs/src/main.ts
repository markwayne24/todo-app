import { NestFactory } from '@nestjs/core';
import { CronjobsModule } from './cronjobs.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(CronjobsModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  app.useLogger(app.get(Logger));
  const port = configService.get<string>('CRONJOBS_PORT', '3002');
  await app.listen(port, () =>
    console.log(`Cronjob listening on port ${port}`),
  );
}
bootstrap();
