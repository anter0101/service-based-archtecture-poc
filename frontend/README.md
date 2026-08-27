# DMS Federated Frontend POC

Independent Next.js apps (auth, shell, dashboard) that share one session cookie and call a NestJS API gateway.

**Read [CONCEPT.md](./CONCEPT.md) for the full idea, architecture diagrams, and auth model.**

```
dms-federated-frontend/
├── apps/
│   ├── auth/          # :3002 — login, register, issues cookie
│   ├── shell/         # :3003 — home / landing
│   └── dashboard/     # :3004 — /users/me + paginated users
├── packages/
│   ├── ui/            # design system + shadcn primitives
│   ├── auth/          # NextAuth config, middleware, session helpers
│   ├── api-client/    # axios → gateway identity APIs
│   ├── i18n/          # next-intl (en/ar)
│   ├── config/        # tsconfig / postcss
│   └── types/         # DTOs mirrored from identity-service
├── CONCEPT.md
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

1. Companion NestJS backend (this monorepo root — gateway `:3000`, identity `:3001`).
2. Node.js >= 20 and pnpm 10+

## Setup

From this `frontend/` folder:

```bash
pnpm install
cp .env.example apps/auth/.env.local
cp .env.example apps/shell/.env.local
cp .env.example apps/dashboard/.env.local
pnpm dev
```

Start the NestJS apps from the **repository root** first (`pnpm dev` there).

| App | URL |
|-----|-----|
| Auth | http://localhost:3002/en/login |
| Shell | http://localhost:3003/en/home |
| Dashboard | http://localhost:3004/en/dashboard |

## Auth / cookie (short)

- Login hits `POST /api/identity/auth/login` on the gateway
- NextAuth stores `user` + `accessToken` in an httpOnly cookie
- All apps share `AUTH_SECRET` so shell/dashboard can decode the session
- API calls use `Authorization: Bearer {accessToken}`

See [CONCEPT.md](./CONCEPT.md) for the sequence diagram and production cookie-domain notes.

## Scope

**In:** federated apps, shared packages, real identity APIs, en/ar i18n  
**Out:** tenants, levels, tree, uploads, forgot/reset (not on this backend yet)
