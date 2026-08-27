import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { configureApp, services } from '@app/common';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = configureApp(await NestFactory.create(GatewayModule), {
    title: 'Gateway',
    description:
      'HTTP entry point. Domain work lives in other apps under /apps.',
  });
  const { port, name } = services.gateway;
  await app.listen(port);
  Logger.log(`${name} running on http://localhost:${port}`, 'Bootstrap');
  Logger.log(`Swagger docs: http://localhost:${port}/api/docs`, 'Bootstrap');
}

void bootstrap();
