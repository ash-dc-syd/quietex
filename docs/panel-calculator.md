# Panel calculator

Linked from Footer > Panel calculator at /panel-calculator. The main navigation stays unchanged.

For one rectangular wall, enter metres, select a catalogue panel and optional finish, choose orientation and 0/10/15 percent extra allowance. Published Size specifications must contain an explicit pair of millimetre dimensions. Unknown sizes require a custom estimate rather than guessed dimensions.

The layout uses ceil(wall width / panel width) columns times ceil(wall height / panel height) rows. Extra allowance is rounded up separately. It does not reuse offcuts, deduct openings, optimise cuts or recommend acoustic coverage. The illustration shows trimmed edge panels; pattern/grain and installation details need confirmation.

Request a Quote carries the panel, finish, estimated quantity and full calculation summary into editable contact fields. Existing server-side enquiry validation still applies. Nothing is submitted until the customer completes and sends the contact form.

Validation: storefront production build and TypeScript passed. Five calculation tests cover published sizes, exact fit/decimal boundaries, partial edge rounding, orientation, allowances and invalid/excessive input. Run with `node --test tests/panel-calculator.cjs` after installing storefront dependencies. Deployed browser checks passed for the footer entry, full catalogue selection, Dulcet orientation changes, stale-result clearing, and quote form panel/finish/quantity/summary prefill. A Stella exact-fit check returned twelve panels without allowance. The calculator and result had no horizontal overflow at the narrow viewport actually reported by the browser (355 px) or desktop (1736 px); temporary viewport overrides were reset.


## Visual panel selection

The panel photo grid pairs every catalogue name with its actual product photo, using the existing Product image role rather than Lifestyle imagery. The selected thumbnail switches to the chosen finish image when available. The photo choices remain visible in a scrollable grid, using native required radio controls for pointer and keyboard selection. There are no custom focus, blur or auto-close handlers. Missing images retain the labelled choice. Quantity calculations and the quote handoff are unchanged.

A browser renderer crash was reported after dropdown selection. Replaced the custom details dropdown and synchronous focus/blur/auto-close behavior with an always-visible native radio grid. This removes the suspected re-entrant focus path while preserving the photos and finish preview. The exact browser-internal cause is not confirmed.
