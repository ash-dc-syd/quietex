# Lifestyle galleries

- Medusa → Lifestyle gallery manages the public At home and At work galleries. Upload photos or choose existing product lifestyle photos, enter an accessible description, optionally add a caption and panel link, reorder, then Save and publish gallery.
- The first gallery opens with the existing homepage space photos. Saving an empty gallery keeps it empty. Gallery membership is independent of product Media; removing a photo from this gallery does not delete the stored file or product image.
- Medusa → Products → select a product → Quietex product-page editor → Lifestyle photos accepts multiple room photos. Save product page publishes them and adds them to the native product Media list with the Lifestyle role.
- Existing Media images can be marked Lifestyle using Gallery image roles. Removing a photo from native Media excludes it from the product gallery and room-photo section, including stale metadata references.
- The public Gallery link and homepage At home / At work cards open /gallery/. Visitors can filter spaces and enlarge photos. Products with active Lifestyle photos show them after The finer details; products without them omit the section.
- Uploads reuse the existing durable Medusa media provider. Public marketing photos only; customer room-preview uploads remain separate and private.
- Save operations protect against stale edits. Gallery and homepage settings share a metadata lock to preserve each other's updates.

Validation: storefront and backend/Admin production builds, TypeScript checks, seven gallery/product-editor tests and eight active-image regression tests passed. The existing site-content schema equality test is outdated because the storefront intentionally localises legacy image paths; no schema change was made for this feature. Deployed UI checks are recorded separately after rollout.
