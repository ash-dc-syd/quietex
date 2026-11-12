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
