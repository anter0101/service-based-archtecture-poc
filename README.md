# Service-based architecture template

NestJS **monorepo** POC: a thin API Gateway plus an Identity service sharing one PostgreSQL database (`identity` schema). Domain DTOs and entities stay in the service that owns them.

```
apps/
  gateway/              public HTTP entry (port 3000): JWT, routing, proxy
  identity-service/     users + auth (port 3001), owns identity schema
libs/
  common/               bootstrap, filters, interceptors, base types
  database/             generic Postgres connection helpers
docker/
  gateway.Dockerfile
  identity.Dockerfile
```

Gateway decides whether a request is allowed and which service should receive it. Identity owns registration, login, password hashing, and JWT issuance.

## Setup

```bash
cp .env.example .env.development
pnpm install
docker compose up postgres -d
pnpm migration:identity:run
pnpm dev
```

| App | URL |
| --- | --- |
| Gateway | http://localhost:3000/api/docs |
| Identity (dev only) | http://localhost:3001/api/docs |

Public through the gateway:

- `POST /api/identity/auth/register`
- `POST /api/identity/auth/login`
- `GET /api/health`

Protected (Bearer JWT):

- `GET /api/identity/users/me`
- `GET /api/identity/users`
- `PATCH /api/identity/users/:id`

The gateway rewrites `/api/identity/auth/login` to Identity `/auth/login`.

## Docker

```bash
docker compose up --build
```

Inside Compose, Gateway talks to Identity at `http://identity-service:3001`. Nginx only terminates HTTP and forwards to the gateway; it does not validate JWTs.

## Commands

```bash
pnpm dev
pnpm dev:gateway
pnpm dev:identity
pnpm test
pnpm test:e2e
pnpm build
pnpm migration:identity:run
```
