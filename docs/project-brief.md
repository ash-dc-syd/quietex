# Quietex website brief

## Agreed direction
Replace the current Quietex website with a custom Next.js storefront backed by Medusa v2, hosted on Railway. Launch as a catalogue and quote website. Customers currently purchase through retailers, including Digital Cinema, Audio Junction and Instyle HiFi. Direct purchasing may be introduced later.

## Initial scope
1. Homepage introducing the range and room applications.
2. Catalogue with product pages, finishes, dimensions and verified specifications.
3. Product-aware quote form with selected product/finish, optional quantity or room dimensions, postcode and project notes.
4. Retailer directory with verified links.
5. Medusa Admin for catalogue management.

No public pricing, shopping cart, checkout or payment processing at launch. Quote enquiries are custom functionality; they must have persistence, notification delivery, input validation and spam protection before launch.

## Design milestone
Deliver the homepage and one complete product page for review before expanding the visual design across the catalogue. Use an architectural interiors style with warm white, charcoal, large room photography and panel detail images. Retain Quietex identity where usable source assets are available.

## Work sequence
- Job 1: application foundation, development setup and Railway configuration.
- Job 2: homepage and one product page design.
- Job 3: complete catalogue, variants and retailers.
- Job 4: saved quote enquiries and email notifications.
- Job 5: responsive QA, accessibility, SEO, redirects and launch.

## Before launch
- Confirm product specifications, approved photos, colour names and download files.
- Confirm which products each retailer supplies and their destination links.
- Confirm enquiry recipients and preferred email service.
- Configure durable product image storage, database backups and monitoring.
- Audit existing URLs and create redirects where routes change.
- Agree privacy, delivery/installation wording and enquiry retention.

## Collaboration
This repository is the shared source of truth for ChatGPT and Codex. Read AGENTS.md and docs/progress.md before starting a new task. Commit each completed job separately. Record evidence and limitations; never describe scaffolding as a deployed or fully tested store.
