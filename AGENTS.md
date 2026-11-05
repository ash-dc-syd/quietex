# Quietex project instructions

## Business requirements
- Australian acoustic panel brand. Launch as a catalogue with quote enquiries.
- No public prices, cart, checkout or payment buttons at launch.
- Products are sold through Digital Cinema, Audio Junction and Instyle HiFi.
- Future direct sales are possible; use Medusa for products and variants now.
- Never invent specifications, certifications, stock, pricing or project testimonials.
- Quote submissions must not claim success until they are saved or delivered.

## Stack and workflow
- Next.js, TypeScript and Tailwind storefront; Medusa v2 backend and admin.
- Railway is the deployment target. Do not substitute another hosting service.
- Preserve staging/live separation; do not change quietex.com.au DNS during development.
- Make a separate commit for each completed job or coherent section.
- Keep credentials in environment variables; commit example files with placeholders only.
- Record completed work, validation and pending decisions in docs/progress.md.
- Run relevant type checks and production builds before declaring a job complete.

## Design
- Architectural interiors direction: warm white, charcoal, spacious type and product photography.
- Primary actions: Explore Panels and Request a Quote.
- Support mobile and desktop, keyboard navigation and labelled form controls.
- Use plain copy and authentic product assets. Clearly identify any illustrative imagery.
