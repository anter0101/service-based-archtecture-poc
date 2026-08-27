export const services = {
  gateway: {
    name: 'gateway',
    get port() {
      return Number(process.env.GATEWAY_PORT ?? 3000);
    },
  },
  identity: {
    name: 'identity-service',
    get port() {
      return Number(
        process.env.IDENTITY_SERVICE_PORT ?? process.env.IDENTITY_PORT ?? 3001,
      );
    },
    get url() {
      return (
        process.env.IDENTITY_SERVICE_URL ??
        process.env.IDENTITY_URL ??
        'http://localhost:3001'
      );
    },
  },
} as const;
