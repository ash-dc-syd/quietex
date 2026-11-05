# First design milestone: content and assets

Reviewed 5 November 2026. Sources are the brand's existing public website, inspected in the rendered browser, including the product variation selectors and associated image attributes.

## Content

| Content | Source |
| --- | --- |
| Brand positioning, room applications and general panel FAQs | https://quietex.com.au/ |
| Stella dimensions, thickness, materials and finish names | https://quietex.com.au/product/stella/ |
| Stella variation image mapping | Product page variation form: `navy-blue-walnut` → `stellawalnut-1.webp`; `sky-grey-blackwood` → `stella-black.webp` |
| Featured panel names and image URLs | Home page product cards |
| Retailer relationships | Ash's instructions in this project |

Stella's face area of 0.36 m² is calculated from its published 600 × 600 mm dimensions. It is not a recommendation for room coverage or acoustic performance. Fire ratings, absorption ratings and numeric sound-reduction claims are not reproduced without technical documents.

## Assets

All images and logos are existing Quietex assets, referenced in `apps/storefront/src/lib/catalogue.ts`. No generated photographs, invented installations or testimonials were added. Room imagery is labelled as visualisation.

- Dark and light Quietex logos: `/wp-content/uploads/2025/10/quietex-logo-{dark,light}.svg`.
- Hero / home application: `/wp-content/uploads/2025/10/home-theatre-hero.webp`.
- Workplace application: `/wp-content/uploads/2025/10/office-hero.webp`.
- About section: `/wp-content/uploads/2026/02/charlotte-home-cinema-image-1-scaled.webp`.
- Stella: `stellawalnut-1-768x768.webp` and `stella-black-768x768.webp` (February 2026 uploads).
- Collection: `margot-sandstone-1-768x768.webp`, `normandy-profile-2-768x768.webp`, `adele-profile-image-768x768.webp` (February 2026 uploads).

For this staging milestone the browser requests assets directly from `quietex.com.au` using unoptimized Next Image components. The existing origin remains a dependency. Before switching the live domain, migrate approved assets to durable storage/new hosting and replace these URLs; otherwise the redesign would depend on the retired WordPress origin. Keep the source website running during design review.

## Scope boundaries

- Stella is the first complete local product page, preserving `/product/stella`.
- The other three cards and full-range link lead to the corresponding existing Quietex pages until subsequent catalogue migration.
- Enquiry actions open an email draft; no message is sent or saved automatically. Stella includes the selected finish in the subject/body context.
- Editorial product data is temporary. Connect it to Medusa after the database/admin deployment.
- Staging remains noindex. Domain cutover, payments, checkout and saved quote enquiries are not part of this milestone.
