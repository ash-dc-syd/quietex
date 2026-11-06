# Quietex enquiries

Website form: https://quietex-production.up.railway.app/contact
Medusa inbox: https://medusa-server-production-456b.up.railway.app/app/enquiries

The form requires a name, email and four-digit Australian postcode. Phone, panel, finish, quantity and project details are optional. Product quote links carry the selected panel and finish into the form.

A successful submission means the enquiry is saved in PostgreSQL. The returned reference is displayed to the customer. No order, payment or customer account is created.

Notifications go to the private Railway ENQUIRY_TO_EMAIL variable. The sender is the existing verified Resend identity; Reply-To is the customer's validated email. The worker records provider acceptance separately from the enquiry itself. Provider acceptance is not the same as final inbox delivery; check Resend for delivery/bounce details.

In Medusa, open Enquiries, select a message and change its status to new, contacted or closed. Use Refresh for recent submissions and delivery updates. Failed notifications retry automatically up to five attempts; Retry notification resets the attempt counter for another try. Pending records are swept every two minutes in case event delivery failed.

Only the server proxy holds ENQUIRY_API_SECRET; it is also configured on the backend for verification. Never prefix this key with NEXT_PUBLIC_. Origin checks, a bounded body, a honeypot, minimum form time and Redis-backed limits reduce automated abuse. Idempotency keys prevent duplicate records when a response is lost. Raw client IP is not stored in the enquiry.

Deployment uses the server pre-deploy migration command already configured in Railway. The new module's SQL migration creates quietex_enquiry. Keep server and worker on the same database and Redis.

Validation commands from the repository root:

- Backend: npm --prefix apps/backend run typecheck; HMR_PORT=5173 npm --prefix apps/backend run build
- Storefront: npm --prefix apps/storefront run typecheck; npm --prefix apps/storefront run build
- Behaviour checks after backend build: node --test tests/enquiries.cjs tests/site-content.cjs

No customer auto-reply or marketing subscription is sent. Attachments and automatic deletion/retention are not configured. Review retention and approved privacy wording before the live-domain launch.
