# Project progress

## Job 1 — foundation prepared, deployment pending

Date: 5 November 2026.

### Implemented
- Separate Next.js storefront and Medusa v2 backend apps, pinned dependencies and npm lockfiles.
- TypeScript and Tailwind, basic responsive Quietex landing page, keyboard skip link and retailer links.
- The current enquiry action opens email. No saved quote form or success message is simulated.
- Server-only Medusa Store API transport ready for future catalogue pages; not yet connected to live products.
- Configurable Medusa server/worker modes, Redis cache/events/workflows/locking and required production secrets.
- Dockerfiles and separate Railway configuration for storefront, server and worker.
- Local PostgreSQL/Redis Compose configuration and environment examples.
- Staging noindex metadata by default, shared project brief and agent instructions.

### Validation
- Both app dependency installations completed and generated lockfiles.
- Storefront TypeScript check and production build passed.
- Backend TypeScript check passed.
- Medusa backend and Admin production build passed with `HMR_PORT=5173`. Automatic HMR port discovery failed because this environment restricts network-interface enumeration; the supported explicit port setting resolved it.
- Redis module import paths resolved against the installed Medusa version.
- Standalone storefront HTTP smoke check passed: homepage, CSS asset delivery, noindex metadata, email quote action and health endpoint. `/cart` and `/checkout` correctly returned 404.
- No live database or Redis server was available, so migrations, admin login, events and real catalogue API requests have not been tested.
- Docker is not available in this environment; container builds and Railway deployment remain unverified.
- Browser visual/responsive QA has not been performed. This landing page is foundation scaffolding, not the first full design milestone.

### Repository access
The foundation was uploaded manually to `main` in commit `c8516df`. The upload matched the validated source except that six dotfiles were omitted and the history bundle was included. GitHub connector write access subsequently became available. The follow-up upload correction restores the dotfiles and removes the handoff bundle from the working tree; the source handoff preserves the original commits separately.

### Next work
1. Verify the upload correction on `ash-dc-syd/quietex` and continue from the current `main` branch.
2. Build the homepage and one real product page with approved Quietex imagery and content; review the visual direction.
3. Deploy Railway staging, run migrations, create admin, configure durable product media and verify service connections.
4. Import verified catalogue data and connect product pages.
5. Implement persisted quote enquiries with validation, spam protection, email notifications and admin visibility.

### Decisions still needed later
- Enquiry recipients and email provider.
- Approved product images/downloads and technical specifications.
- Product-level retailer destinations and retailer availability.
- Privacy wording, enquiry retention and launch redirects.

Future cart/checkout is optional and remains outside launch scope. The live Quietex site and DNS have not been modified.
