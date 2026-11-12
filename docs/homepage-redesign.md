# Homepage visual refresh

Adapted the user-provided Claude homepage HTML into the existing Next.js/Medusa storefront. Kept the real product catalogue, Product/Lifestyle card crossfade, product galleries, finish selection, specifications, quote storage/email flow, private room-photo requests, stable panel calculator photo grid and footer calculator link. Main navigation still omits room preview and calculator.

Uses local Inter and Newsreader italic font assets extracted from the supplied reference, with its SIL font licences preserved in public/fonts/OFL.txt. No bundled reference JavaScript, fake product illustrations, unverified free-consultation promise, retailer addresses or placeholder photo labels are included.

Typography, spacing, colours, hero, collection, retailer cards, FAQ, footer and responsive layouts follow the reference. The homepage enquiry section reuses the existing contact form and submission API, retaining all existing required fields, idempotency and receipt handling. Other enquiry callouts keep their existing links. The editor continues to control content, section order, visibility, images and publishing. Text-only banner sections can display the editable calculator callout without an empty image column.

Copy and section order are applied through the existing visual editor, rather than overriding saved content in code. Existing specifications, uploaded media and product metadata are not changed. The original domain and DNS are not changed.

The supplied collection-grid reference is implemented with tall image cards, genuine finish-image swatches, accurate Product/Lifestyle labels, and finish-tone filters based on the catalogue variant names. Products can belong to more than one finish group. Existing hover/focus transitions and product links remain. The collection enquiry section uses the same working contact form.

Production build and TypeScript passed; all five panel calculator tests passed. Live desktop checks confirmed published copy/section order, inline form panel-to-finish selection, FAQ expansion, all eleven products, each finish filter, tall card ratio and the unchanged 300 ms lifestyle/product crossfade. Mobile and retained product workflows are checked after deployment.

Footer refinement: centred the logo, horizontal wrapping navigation and email link; removed repeated footer taglines and headings; reduced padding. Calculator, retailer and contact links, copyright, product caveat and Back to top remain.
