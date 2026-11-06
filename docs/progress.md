# Project progress

## Job 1 — foundation and Railway services deployed

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
- At initial local validation no database or Redis service was available. Railway migrations and Redis connectivity have since been verified (see backend deployment below). Authenticated admin access and catalogue integration still need setup.
- Storefront deployed successfully to Railway using its Dockerfile (reported by Ash). Public HTTP verification passed at https://quietex-production.up.railway.app/: homepage 200, CSS asset 200, noindex/nofollow metadata present, expected email quote action present, and `/api/health` 200 with `{"status":"ok","service":"quietex-storefront"}`. Railway's environment label is production, but this project is being used for staging; the live Quietex domain remains unchanged.
- Backend/worker Docker deployment, database migrations and Redis connectivity are now verified. The admin sign-in page loads; no admin invitation has been created yet.
- The complete homepage and first Stella page are deployed and browser-tested as described in Job 2 below.

### Repository access
The foundation was uploaded manually to `main` in commit `c8516df`. The upload matched the validated source except that six dotfiles were omitted and the history bundle was included. GitHub connector write access subsequently became available. The follow-up upload correction restores the dotfiles and removes the handoff bundle from the working tree; the source handoff preserves the original commits separately.

### Next work
1. Continue from `main`; upload correction `6094cfd` is verified. Storefront preview: https://quietex-production.up.railway.app/.
2. Review the deployed homepage and Stella page; confirm the visual direction.
3. Confirm the email for the first Medusa administrator and create an invitation so Ash sets the password. Configure durable product media.
4. Import verified catalogue data and connect product pages.
5. Implement persisted quote enquiries with validation, spam protection, email notifications and admin visibility.

### Decisions still needed later
- Enquiry recipients and email provider.
- Approved product images/downloads and technical specifications.
- Product-level retailer destinations and retailer availability.
- Privacy wording, enquiry retention and launch redirects.

Future cart/checkout is optional and remains outside launch scope. The live Quietex site and DNS have not been modified.

## Job 2 — homepage and Stella design deployed

Completed in separate commits:
- `8be5b33`: architectural homepage using existing Quietex photography/logo, collection, applications, FAQs, retailer links and enquiry callout.
- `12ebccd`: Stella page at https://quietex-production.up.railway.app/product/stella with product details, finish/image selection and a finish-aware email enquiry.

Checks passed: TypeScript, production build, standalone HTTP checks for both pages, local links, CSS delivery, noindex, health endpoint and absence of cart/checkout. Browser QA verified the desktop homepage at 1440 px, loaded hero/collection imagery, product navigation, changing to Sky Grey / Blackwood updates both image and email context, and the mobile navigation at 390 px opens/closes without horizontal overflow.

See docs/content-sources.md for content provenance and scope. Images currently load from the old Quietex website. Other product cards still link to the original product pages. These assets must be migrated before changing the live domain. Enquiries still open email drafts; they are not saved in Medusa yet.

## Medusa backend deployment — verified 6 November 2026

Admin: https://medusa-server-production-456b.up.railway.app/app
Health: https://medusa-server-production-456b.up.railway.app/health

Railway project: `b1ed9bb2-de53-471d-b50e-992713842698`
Environment: `c6f23b9c-1164-444d-babc-9658cb5087f8` (labelled production; this project is staging).

| Service | Railway service ID | Verified state |
| --- | --- | --- |
| Storefront | `1e2aae87-a1df-45ba-b893-5ce7f71056f0` | Online |
| Postgres | `573e012d-7418-4d24-95c9-47bbd2dd949f` | Online, persistent volume |
| Redis | `228285c3-5ba3-4661-a5a1-02194659fb6b` | Online, persistent volume |
| Medusa server | `f5d73efb-e206-48bf-8d24-548cc97f1ed6` | Online, health 200 OK, admin page rendered |
| Medusa worker | `02564548-5dfe-4e74-bb47-3d6b6d36be6f` | Online, Redis connections and ready log verified |

Both Medusa services use repository main, root /apps/backend and the supplied Dockerfile. Settings are configured directly in Railway's UI; no new legacy Config-as-Code path was enabled. Server pre-deploy command is `npm run db:migrate`, health path /health, timeout 300 seconds. Worker has no migration pre-deploy step, public domain or HTTP health check.

Server mode is `server`; worker mode is `worker`. Both reference the same Postgres and Redis private connection variables. Secrets were generated using Railway's secret template and the worker references the server values. Secret values are not stored in the repository. CORS is configured for the staging storefront and server origins. Server public URL is supplied at build time for Admin.

Verification:
- Server deployment `3e37f9d8-84d2-4d35-95df-92f74f3760f9` built its Admin bundle, ran database migrations, synchronized links and completed migration scripts.
- Server log: ready on port 9000.
- Worker initially started before link migrations completed and automatically restarted; subsequent logs confirm Redis cache, event bus, locking and workflow connections, followed by ready on port 9000. On future first-time environments, wait for server migrations before starting the worker.
- Public /health returns 200 OK; /app returns 200 and renders the Medusa sign-in form in the browser.
- Unauthenticated /admin/products returns 401.
- Railway server console is connected and available.

Remaining: first admin invitation (email needs confirmation), admin sign-in, durable media storage, catalogue import and publishable key/sales-channel connection to the storefront. The frontend still uses editorial product data and is not yet driven by the new Medusa catalogue. No live Quietex domain or DNS changes were made.

## Job 3 — Medusa catalogue connected (6 November 2026)

- First administrator signed in successfully.
- Imported 11 panels and 24 finish variants from the existing Quietex product pages. Preserved product handles, dimensions and material specifications. Corrected Adele's source variant image, which incorrectly referenced Marcel.
- Imported no prices or stock quantities. Published products use a dedicated Quietex Catalogue sales channel and storefront publishable key configured in Railway variables.
- Added an idempotent import script that skips existing handles to preserve later admin edits.
- Homepage featured products, /our-products and all /product/[handle] pages now read the Medusa Store API without caching. The earlier static Stella page and editorial product-card data are superseded.
- Finish selection updates the image and email enquiry context. Quote requests still open email drafts and are not persisted.
- Backend and storefront TypeScript checks and production builds passed. Store API verification returned 11 products and 24 variants. Public catalogue returned 200 with all 11 local product links; browser verification confirmed Stella finish selection updates both image and email context.
- Server and storefront Railway watch paths now scope builds to their respective app directories.

Remaining before launch: durable product media (images currently reference the original WordPress site), persisted quote enquiries and notifications, content approval, privacy and redirects. The live Quietex domain and DNS remain unchanged.

## Admin email integration — 6 November 2026

- Added Resend Notification Module Provider using the HTTPS sending API, with plain-text and HTML invitation/password-reset templates. No API key is stored in source.
- Subscribers handle invite.created, invite.resent and admin auth.password_reset. URLs use the configured public backend URL and safely encoded tokens/email values. Customer reset emails are excluded because the quote-only storefront has no customer accounts.
- Configured notify.quietex.com.au in Resend and added its DKIM TXT and two sending CNAME records in SiteGround. Existing website and mailbox DNS records were preserved.
- RESEND_API_KEY and RESEND_FROM_EMAIL are Railway variables; worker references server values. Provider is enabled when its key is present.
- TypeScript and full Medusa/Admin production build passed. Mocked provider checks passed for template rendering, URL validation, HTML escaping, retry idempotency and sanitized delivery failures.
- Live deployment, DNS verification and end-to-end delivery checks are pending.
