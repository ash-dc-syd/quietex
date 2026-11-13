# PET felt material reference

The About page contains a newly drawn graph of the six octave-band absorption values reported in the supplied **LightEFX PET Acoustic Panels, 12 mm** reference, page 1. The reference is competitor product literature, not a Quietex laboratory report. Management previously stated the materials share specifications; that does not by itself establish certificate coverage for each finished panel.

| Frequency (Hz) | Reported absorption coefficient, αs |
| --- | --- |
| 125 | 0.00 |
| 250 | 0.06 |
| 500 | 0.25 |
| 1000 | 0.56 |
| 2000 | 0.77 |
| 4000 | 0.96 |

Reported setup: ISO 354:2003; Type A direct fixing with no air gap; 2440 × 1220 × 12 mm PET specimen, 168 kg/m³, test area 10.8 m². The reference reports NRC 0.40 and αw 0.30 (MH), Class D. They are explicitly identified as reported reference values on the website. No additional measurements, smooth interpolated curve, bass isolation or whole-range performance are claimed.

The chart data is in `apps/storefront/src/data/pet-reference.json`. Run `python scripts/render-pet-reference.py` with matplotlib installed to regenerate the desktop and mobile SVGs. `--preview-dir PATH` optionally generates PNG review images. The public page includes the exact values in an accessible table, the test conditions, source and scope limitations.

## Fire and environmental evidence still required

The reference lists Group 1 to AS 5637.1-2015, greater than 75% recycled content, a VOC result and a Global GreenTag EPD. None is published as a Quietex certificate or whole-range claim. The public page offers product-specific document enquiries instead.

Obtain the full fire classification and acoustic reports with written mapping to Quietex models, thicknesses, finishes, substrates and fixing methods. Obtain the recycled-content declaration, VOC report, actual registered EPD and any applicable permissions. Group 1 is a reaction-to-fire classification, not a fire-resistance duration or a claim that material is non-combustible. Avoid “fireproof” and blanket approval for every building/application.

The reference smoke units and inconsistent mass/density figures remain unresolved and are not republished. Competitor colours, product range, logos, images and warranty were excluded.

Validation: production storefront build passed. Graph values and test conditions were checked against the reference PDF's page 1 table; no colour information was imported.
