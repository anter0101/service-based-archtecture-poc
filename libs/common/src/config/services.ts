export const services = {
  gateway: {
    name: 'gateway',
    port: Number(process.env.GATEWAY_PORT ?? 8080),
  },
  identity: {
    name: 'identity-service',
    port: Number(process.env.IDENTITY_PORT ?? 8081),
    url: process.env.IDENTITY_URL ?? 'http://localhost:8081',
  },
} as const;
