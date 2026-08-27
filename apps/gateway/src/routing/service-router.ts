import { Injectable } from '@nestjs/common';
import { services } from '@app/common';
import {
  serviceRoutes,
  type ServiceName,
  type ServiceRoute,
} from './service-routes';

@Injectable()
export class ServiceRouter {
  resolve(path: string): ServiceRoute | undefined {
    return [...serviceRoutes]
      .filter(
        (route) => path === route.prefix || path.startsWith(`${route.prefix}/`),
      )
      .sort((a, b) => b.prefix.length - a.prefix.length)[0];
  }

  getTargetUrl(name: ServiceName): string {
    const service = services[name];
    if (!service || !('url' in service)) {
      throw new Error(`No url configured for service "${name}"`);
    }
    return service.url;
  }
}
