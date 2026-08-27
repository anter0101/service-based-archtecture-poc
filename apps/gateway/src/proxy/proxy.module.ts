import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { jwtExcludeRoutes, proxyRoutes } from '../routing/service-routes';
import { ProxyMiddleware } from './proxy.middleware';

@Module({
  providers: [ProxyMiddleware],
})
export class ProxyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const routes = proxyRoutes();

    consumer
      .apply(JwtAuthGuard)
      .exclude(...jwtExcludeRoutes())
      .forRoutes(...routes);

    consumer.apply(ProxyMiddleware).forRoutes(...routes);
  }
}
