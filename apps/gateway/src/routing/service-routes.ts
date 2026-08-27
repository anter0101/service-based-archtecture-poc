export type ServiceName = 'identity';

export type ServiceRoute = {
  prefix: string;
  service: ServiceName;
  requireAuth: boolean;
  handledByModule?: boolean;
};

export const serviceRoutes: ServiceRoute[] = [
  {
    prefix: '/api/auth',
    service: 'identity',
    requireAuth: false,
    handledByModule: true,
  },
  {
    prefix: '/api/users',
    service: 'identity',
    requireAuth: true,
    handledByModule: true,
  },
];
