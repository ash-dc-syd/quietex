# Railway staging setup

Create a new Railway project named `quietex-staging`. Use the `ash-dc-syd/quietex` repository. Keep the current website and domain unchanged.

## Services

| Service | Source / root directory | Config file (repository-relative) | Public access |
| --- | --- | --- | --- |
| PostgreSQL | Railway database | Managed by Railway | Private |
| Redis | Railway database | Managed by Railway | Private |
| Medusa server | GitHub / `apps/backend` | `/apps/backend/railway.toml` | Generate a Railway domain |
| Medusa worker | GitHub / `apps/backend` | `/apps/backend/railway-worker.toml` | No public domain |
| Storefront | GitHub / `apps/storefront` | `/apps/storefront/railway.toml` | Generate a Railway domain |

The Docker build context is the service root directory. Set the config file explicitly in each service's settings. The server runs migrations in its pre-deploy command. The worker does not run migrations: deploy/start it after the server's first successful migration. Do not enable server-style HTTP health checks on the worker.

## Backend environment

Set on both server and worker:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Reference the Railway PostgreSQL private connection URL |
| `REDIS_URL` | Reference the Railway Redis private connection URL |
| `JWT_SECRET` | A securely generated random secret, identical on both services |
| `COOKIE_SECRET` | Another securely generated random secret, identical on both services |
| `MEDUSA_BACKEND_URL` | The server's public HTTPS URL; also used when building Admin |
| `STORE_CORS` | Storefront HTTPS origin |
| `ADMIN_CORS` | Server HTTPS origin |
| `AUTH_CORS` | Storefront and server HTTPS origins, comma separated |
| `PORT` | `9000` |

Set `MEDUSA_WORKER_MODE=server` on the server, and `MEDUSA_WORKER_MODE=worker` on the worker. Admin is disabled automatically in worker mode. Runtime `NODE_ENV=production` is supplied by the Docker image.

Generate domains before the first complete deployment so `MEDUSA_BACKEND_URL` and CORS contain real staging origins. If these change, rebuild the server so Admin uses its correct URL.

Redis powers shared cache, events, workflows and locks. No external email or payment provider is needed for the foundation. Media storage must be configured before uploading products; do not rely on container disk.

## Storefront environment

| Variable | Value |
| --- | --- |
| `MEDUSA_BACKEND_URL` | Server URL; use the public HTTPS origin initially |
| `MEDUSA_PUBLISHABLE_KEY` | Medusa publishable key scoped to the website's sales channel |
| `NEXT_PUBLIC_SITE_URL` | Storefront HTTPS URL |
| `SITE_INDEXABLE` | `false` for staging |
| `PORT` | `3000` |

The current landing page does not depend on Medusa being reachable. The `MEDUSA_*` values are for subsequent catalogue integration. Public URL and indexing metadata are read at build time: rebuild after changing them.

## Verify before marking staging ready

1. Server `/health` returns OK and logs show migrations completed.
2. Create an admin account securely through Railway's service shell from `/app`, using the Medusa CLI; never put a password in repository files or deployment scripts.
3. Confirm admin sign-in at `/app`, and that the worker starts against the same databases without errors.
4. Storefront `/api/health` returns `{"status":"ok","service":"quietex-storefront"}`.
5. Inspect desktop and mobile pages, retailer links and the email enquiry action.
6. Confirm staging pages carry noindex metadata. Noindex is not access protection; restrict staging separately if confidential content is added.

## Not configured yet

S3-compatible media storage, saved quote enquiries, email delivery, real products/variants, automated backups, error monitoring and a live migration/redirect plan. Docker images and Railway runtime need deployment validation; successful local builds alone do not verify Railway.
