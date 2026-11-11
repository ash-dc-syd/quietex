# Image storage and editing

Medusa uses the built-in S3 File Module Provider when S3_BUCKET is configured. Railway server and worker reference the bucket variables for S3_ENDPOINT, S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY. MEDUSA_BACKEND_URL must be the public HTTPS backend URL. No credentials belong in the storefront or source.

Railway buckets remain private. The backend /media/:filename route streams only raster image extensions with Medusa-generated ULID names, immutable caching, nosniff and a restrictive content security policy. CSV exports, PDF files and SVGs are not public through this route. ACL headers are disabled for Railway compatibility.

Products: upload images in Medusa Products and save the product. Homepage: choose Website editor, select a section, use Upload image (PNG, JPG, WebP, GIF, AVIF, up to 10 MB), then Publish changes and confirm Publish homepage. Uploading or Save draft alone does not publish. The editor shows whether the draft differs from the published homepage. Refresh an already-open storefront tab after publishing.

Old WordPress URLs remain until images are replaced or migrated. New uploads use the backend media URL and survive container redeploys. Do not delete old source images until migration is complete.

## Product pages

Open Products, choose a panel and use Quietex product-page editor. Specifications can be added, edited and removed; each finish has an upload, URL and existing-gallery image picker. Save product page applies those changes directly to published products. The ordinary Medusa controls still manage product title, description, options and media. The storefront now renders the complete product media gallery as selectable thumbnails. Picking a finish selects that finish's image.

The editor protects against stale saves and rejects variants that do not belong to the product. It preserves unrelated product metadata and uses Medusa's product workflow. It does not add prices, stock or checkout.

## Image roles and order

In the Quietex product-page editor, Gallery image roles labels each image Product, Detail or Lifestyle. The first Lifestyle image is used on catalogue and homepage cards; the first Product image appears on hover or keyboard focus. Missing lifestyle images fall back to product imagery. Touch devices retain the default image; reduced-motion preference disables the transition.

On product pages, Product images come first, Detail images next and Lifestyle images last. The first Product image opens initially. Choosing a finish switches to its finish photo. Use the role-specific up/down controls to order images within a group, then Save product page. Upload new gallery photos through Medusa Media, or use the existing finish upload controls.

Explicit image_roles metadata takes priority. Visually reviewed existing Quietex assets have initial role defaults: room photos for Caroline and Dulcet Carved, plus material close-ups across the catalogue. Other images default to Product; no lifestyle imagery is invented. Removed images are ignored unless still attached as a thumbnail or finish photo.
