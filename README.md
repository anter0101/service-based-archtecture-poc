# Service-based architecture template

End-to-end POC: **NestJS backend services** + **federated Next.js frontends** that share one auth session and talk through an API gateway.

**Read [CONCEPT.md](./CONCEPT.md)** for the architecture idea, diagrams, and auth model.

```
.
├── apps/                         # NestJS services
│   ├── gateway/                  # :3000 — JWT gate + proxy
│   └── identity-service/         # :3001 — users + auth
├── libs/
│   ├── common/
│   └── database/
├── frontend/                     # Federated Next.js monorepo
│   ├── apps/
│   │   ├── auth/                 # :3002 — login / register / cookie
│   │   ├── shell/                # :3003 — home
│   │   └── dashboard/            # :3004 — users workspace
│   └── packages/                 # @dms/ui, auth, api-client, i18n, types, config
├── CONCEPT.md
└── docker-compose.yml
```

---

## Backend

```bash
cp .env.example .env.development
pnpm install
docker compose up postgres -d
pnpm migration:identity:run
pnpm dev
```

| App | URL |
| --- | --- |
| Gateway Swagger | http://localhost:3000/api/docs |
| Identity Swagger (dev) | http://localhost:3001/api/docs |

Public: `POST /api/identity/auth/register`, `POST /api/identity/auth/login`, `GET /api/health`  
Protected (Bearer JWT): `GET /api/identity/users/me`, `GET /api/identity/users`, …

---

## Frontend

```bash
cd frontend
pnpm install
cp .env.example apps/auth/.env.local
cp .env.example apps/shell/.env.local
cp .env.example apps/dashboard/.env.local
pnpm dev
```

| App | URL |
| --- | --- |
| Auth | http://localhost:3002/en/login |
| Shell | http://localhost:3003/en/home |
| Dashboard | http://localhost:3004/en/dashboard |

All three apps share `AUTH_SECRET` and a NextAuth session cookie. API calls go to the gateway with `Authorization: Bearer {accessToken}`.

More detail: [frontend/README.md](./frontend/README.md) and [CONCEPT.md](./CONCEPT.md).

---

## Docker (backend)

```bash
docker compose up --build
```

Gateway → Identity at `http://identity-service:3001`. Nginx terminates HTTP only; it does not validate JWTs.

---

## Backend commands

```bash
pnpm dev
pnpm dev:gateway
pnpm dev:identity
pnpm test
pnpm test:e2e
pnpm build
pnpm migration:identity:run
```
