import { RequestMethod } from '@nestjs/common';
import { services } from '@app/common';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ServiceRoute = {
  prefix: string;
  service: 'identity';
  publicExactPaths: Array<{ method: HttpMethod; path: string }>;
};

export const serviceRoutes: ServiceRoute[] = [
  {
    prefix: '/api/identity',
    service: 'identity',
    publicExactPaths: [
      { method: 'POST', path: '/auth/register' },
      { method: 'POST', path: '/auth/login' },
    ],
  },
  // Future prefixes (not wired in V1):
  // /api/infrastructure -> infrastructure-service
  // /api/disasters -> disaster-service
];

export function pathnameOf(url: string): string {
  return url.split('?')[0] ?? url;
}

export function matchServiceRoute(pathname: string): ServiceRoute | undefined {
  return [...serviceRoutes]
    .filter(
      (route) =>
        pathname === route.prefix || pathname.startsWith(`${route.prefix}/`),
    )
    .sort((a, b) => b.prefix.length - a.prefix.length)[0];
}

export function rewritePath(pathname: string, route: ServiceRoute): string {
  const rest = pathname.slice(route.prefix.length) || '/';
  return rest.startsWith('/') ? rest : `/${rest}`;
}

export function isPublicRoute(
  method: string,
  pathname: string,
  route: ServiceRoute,
): boolean {
  const rest = rewritePath(pathname, route);
  const verb = method.toUpperCase();
  return route.publicExactPaths.some(
    (entry) => entry.method === verb && entry.path === rest,
  );
}

export function targetUrlFor(route: ServiceRoute): string {
  switch (route.service) {
    case 'identity':
      return services.identity.url;
    default:
      throw new Error(`Unknown service: ${String(route.service)}`);
  }
}

export function jwtExcludeRoutes() {
  return serviceRoutes.flatMap((route) =>
    route.publicExactPaths.map((entry) => ({
      path: `${route.prefix.replace(/^\//, '')}${entry.path}`,
      method: RequestMethod[entry.method],
    })),
  );
}

export function proxyRoutes() {
  return serviceRoutes.map((route) => ({
    path: `${route.prefix.replace(/^\//, '')}/(.*)`,
    method: RequestMethod.ALL,
  }));
}
