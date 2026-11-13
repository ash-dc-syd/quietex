# Quietex launch preparation

## Implemented

- Preserve all eleven existing WordPress product URLs, including trailing slashes.
- Preserve `/about/`, `/our-products/` and `/contact-us/`; redirect `/contact` while retaining enquiry parameters.
- Use team-created panel mockup wording in the room preview invitation. Keep the photo processing consent accurate.
- Add canonical metadata, a product sitemap and host-aware search indexing controls.
- Copy public assets into the Docker runtime, including the local font files.

## Existing product paths

| Product | Path |
| --- | --- |
| Adele | `/product/adele/` |
| Caroline | `/product/caroline/` |
| Charlotte | `/product/charlotte/` |
| Chloé | `/product/chloe-acoustic-panel/` |
| Dulcet | `/product/dulcet-acoustics-panel/` |
| Dulcet Carved | `/product/dulcet-carved-acoustics-panel/` |
| Madeleine | `/product/black-with-soundwave-pattern/` |
| Marcel | `/product/marcel/` |
| Margot | `/product/margot/` |
| Normandy | `/product/normandy/` |
| Stella | `/product/stella/` |

## Validation

Production storefront build passed. Ten targeted Node tests passed. Local production-server checks passed for all eleven legacy product paths, canonical URLs, legacy content routes, query-preserving redirects, missing-product 404s, fonts, and the new mockup wording. With production indexing enabled, the live host returns seventeen sitemap URLs; the Railway preview host remains blocked from indexing.

## Before switching the domain

- Verify deployed media: all 75 referenced legacy assets were extracted from the supplied archive, checked and copied to the original `/wp-content/uploads/` paths. Storefront rendering uses local paths after image role selection, preserving gallery ordering and finish images. Archive logs, scripts and unrelated files were excluded. Checksums are recorded in `legacy-media-manifest.json`.
- Confirm a restorable old-site backup and record the existing web DNS records privately.
- Add the apex and www domains to Railway and use the exact DNS values Railway supplies. Preserve all email DNS records.
- Set `NEXT_PUBLIC_SITE_URL=https://quietex.com.au` and `SITE_INDEXABLE=true` for the live storefront and rebuild. Update the backend storefront origin and permitted origins as needed.
- Verify HTTPS, original product paths, images, quote submissions, room-photo uploads and staff email delivery on the actual domain.
- Verify mobile layouts, retailer links and contact details. Keep the previous hosting available for rollback.
- Submit the live sitemap to Search Console after cutover.

The DNS switch has not been performed as part of these preparation changes.

## About page

The original `/about/` route now has a full editorial layout: a room-photo hero, published brand introduction, PET felt material detail, project mockup guidance, retailer links and quote enquiry. Desktop/mobile navigation and the footer link directly to this page. The introduction and hero image continue using the published About settings in the website editor. Generic certification, recycled-content percentages, installation-safety and weight claims from the old page were not republished without product-specific evidence.

## Plain-language copy revision

Simplified the homepage and About wording, including navigation announcement, material descriptions, quote callouts and retailer text. Preserved layout, panel data, images and enquiry behaviour. Updated both editor field defaults and storefront defaults; existing saved homepage content was also revised and published through the authenticated Medusa editor, preserving section order, visibility, images and link targets.

## PET material information

Added an About-page material reference graph with the six reported octave-band values from the supplied 12 mm PET literature. Labels, source, direct-fix/no-air-gap conditions and model-specific limitations accompany the graph and table. The homepage links to this section. Fire and environmental document enquiry links are included; unverified whole-range certifications, fireproof claims, recycled-content percentages and certification logos are excluded. See `pet-material-reference.md` for provenance and evidence still required.

## Fewer repeated enquiry sections

The homepage keeps one short enquiry form with name, email, postcode and optional message. Contact retains the full quote form, including panel, finish, quantity and project details. About and the collection use compact quote links; product pages retain the finish-aware quote button beside the product and remove the repeated bottom enquiry block. Room-photo requests retain their separate photo-upload form. Product and calculator quote links go directly to `/contact-us/`, retaining their query parameters. No enquiry API, email delivery or photo-storage logic was changed.

Validation: storefront production build passed. Server-rendered form checks verified the four-field homepage form and full-form panel, finish, quantity and message prefills. The compact payload was accepted by the existing enquiry validator without optional phone or quantity values. No external test messages were sent.

## Wide-screen calculator and contact layouts

Removed the conflicting outer max-width from the shared contact-page grid. Its viewport-based section padding already centres a readable content area; combining both caused the calculator, contact form and photo form to collapse on wide screens. Capped the column gap and retained the single-column breakpoint at 850 px. Calculator arithmetic and field behaviour are unchanged.

The product quote button now fits its label instead of spanning the full product column, with a 46 px minimum tap height and smaller text/padding. The selected panel and finish remain in the quote link.

## Compact product layout

Finish choices now use compact photo chips that wrap as needed instead of stretching across the column. The room mockup and retailer links sit together below the quote action. Product content is centred within 1200 px; the main image uses a bounded, uncropped frame and thumbnail images use a single scrollable row. Product-first gallery ordering, finish selection and quote/mockup URL parameters are unchanged.
