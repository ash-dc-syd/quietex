# Image storage and editing

Medusa uses the built-in S3 File Module Provider when S3_BUCKET is configured. Railway server and worker reference the bucket variables for S3_ENDPOINT, S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY. MEDUSA_BACKEND_URL must be the public HTTPS backend URL. No credentials belong in the storefront or source.

Railway buckets remain private. The backend /media/:filename route streams only raster image extensions with Medusa-generated ULID names, immutable caching, nosniff and a restrictive content security policy. CSV exports, PDF files and SVGs are not public through this route. ACL headers are disabled for Railway compatibility.

Products: upload images in Medusa Products and save the product. Homepage: choose Website editor, select a section, use Upload image (PNG, JPG, WebP, GIF, AVIF, up to 10 MB), then Publish changes and confirm Publish homepage. Uploading or Save draft alone does not publish. The editor shows whether the draft differs from the published homepage. Refresh an already-open storefront tab after publishing.

Old WordPress URLs remain until images are replaced or migrated. New uploads use the backend media URL and survive container redeploys. Do not delete old source images until migration is complete.

## Product pages

Open Products, choose a panel and use Quietex product-page editor. Specifications can be added, edited and removed; each finish has an upload, URL and existing-gallery image picker. Save product page applies those changes directly to published products. The ordinary Medusa controls still manage product title, description, options and media. The storefront now renders the complete product media gallery as selectable thumbnails. Picking a finish selects that finish's image.

The editor protects against stale saves and rejects variants that do not belong to the product. It preserves unrelated product metadata and uses Medusa's product workflow. It does not add prices, stock or checkout.
