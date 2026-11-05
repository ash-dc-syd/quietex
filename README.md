# Quietex

Australian acoustic panel catalogue and quote website. Products are purchased through retailers at launch; direct ecommerce may be added later.

## Applications

- `apps/storefront`: Next.js 16, React 19, TypeScript and Tailwind CSS.
- `apps/backend`: Medusa v2 catalogue and admin, with PostgreSQL and Redis.
- `docs/project-brief.md`: agreed scope and business requirements.
- `docs/progress.md`: completed work, verification and next tasks.
- `docs/railway.md`: staging deployment instructions.

Each app has its own npm lockfile and is deployed from its own Railway root directory. There are no npm workspaces; run dependency commands inside the relevant app. Use Node 24 LTS (`.nvmrc`).

## Run the storefront

```bash
cd apps/storefront
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The foundation page runs without Medusa. It has retailer links and an email enquiry action; the catalogue and saved quote form are subsequent milestones.

## Run Medusa

Start local databases from the repository root (requires Docker Compose):

```bash
docker compose up -d
```

Then:

```bash
cd apps/backend
npm ci
cp .env.example .env
```

Replace both placeholder secrets in `.env` with separate random values before starting. Generate each locally with `openssl rand -hex 32`.

```bash
npm run db:migrate
npm run dev
```

The server is at http://localhost:9000; admin at http://localhost:9000/app. Create the first admin locally using `npx medusa user --help` and the CLI's email/password options. Do not commit credentials. Do not run an ecommerce starter's demo product seed for this project.

For catalogue integration, create a sales channel and a publishable API key in Medusa Admin, attach published products to that channel, and add the key to the storefront's `MEDUSA_PUBLISHABLE_KEY`. The catalogue transport is server-only. The current foundation page does not yet call it.

## Checks

From the repository root, after installing both apps:

```bash
npm run check
npm run storefront:build
npm run backend:build
```

Production builds check TypeScript; type errors are not suppressed. Database migrations, admin sign-in and actual API calls require a running database and are separate runtime checks.

In a restricted environment where Medusa's automatic HMR port detection fails with `uv_interface_addresses`, build with `HMR_PORT=5173 npm run backend:build`. This uses the supported HMR port setting and does not disable Admin or type checks.

## Deployment

Use Railway staging first. The backend Docker image runs the compiled `.medusa/server` output. The storefront Docker image runs Next.js standalone output. See [Railway setup](docs/railway.md). Keep `SITE_INDEXABLE=false` until launch. No live domain or existing website changes are part of initial setup.

Before product uploads or launch, configure durable S3-compatible image storage; the default local Medusa file provider is not suitable for separate server/worker containers. Email delivery, quote persistence, product import, backups and redirects remain pending.
