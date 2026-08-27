import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { serviceRoutes } from '../routing/service-routes';
import { ProxyMiddleware } from './proxy.middleware';

function prefixToPath(prefix: string) {
  return `${prefix.replace(/^\//, '')}/(.*)`;
}

@Module({
  providers: [ProxyMiddleware],
})
export class ProxyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const proxied = serviceRoutes.filter((route) => !route.handledByModule);
    const protectedRoutes = proxied
      .filter((route) => route.requireAuth)
      .map((route) => ({
        path: prefixToPath(route.prefix),
        method: RequestMethod.ALL,
      }));

    if (protectedRoutes.length > 0) {
      consumer.apply(JwtAuthGuard).forRoutes(...protectedRoutes);
    }

    consumer.apply(ProxyMiddleware).forRoutes('*');
  }
}
