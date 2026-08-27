import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { configureApp, services } from '@app/common';
import { IdentityModule } from './identity.module';

async function bootstrap() {
  const app = configureApp(await NestFactory.create(IdentityModule), {
    title: 'Identity service',
    description: 'Domain service for users. Add new modules under src/modules.',
  });
  const { port, name } = services.identity;
  await app.listen(port);
  Logger.log(`${name} running on http://localhost:${port}`, 'Bootstrap');
  Logger.log(`Swagger docs: http://localhost:${port}/api/docs`, 'Bootstrap');
}

void bootstrap();
