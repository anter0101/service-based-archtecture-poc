# Service-based architecture template

NestJS **monorepo**: each domain is its own app under `apps/`, shared code lives in `libs/`. Domain DTOs stay in the service that owns them. The gateway validates JWTs; identity-service issues them.

```
apps/
  gateway/                 HTTP entry (port 8080): JWT, routing table, proxy
  identity-service/        users + auth (register/login) on port 8081
libs/
  common/                  bootstrap, filters, interceptors, base types
  database/                shared Postgres TypeORM connection
docker/
  gateway.Dockerfile
  identity.Dockerfile
```

Add a service with `pnpm exec nest generate app billing-service`, register it in `libs/common` `services.ts`, then add a prefix in `apps/gateway/src/routing/service-routes.ts`. Routes without `handledByModule` are forwarded by the gateway proxy.

## Setup

```bash
cp .env.example .env.development
pnpm install
docker compose up postgres -d
pnpm start:identity:dev
pnpm start:dev
```

| App | URL |
| --- | --- |
| Gateway | http://localhost:8080/api/docs |
| Identity | http://localhost:8081/api/docs |

Register and login are public (`POST /api/auth/register`, `POST /api/auth/login`). User routes on the gateway require `Authorization: Bearer <token>`.

## Docker

```bash
docker compose up --build
```

Nginx fronts the gateway on http://localhost

## Commands

```bash
pnpm test
pnpm test:e2e
pnpm build
pnpm migration:run
```
