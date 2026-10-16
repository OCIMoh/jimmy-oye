# UI/UX Audit & Visual Discrepancy Analysis: "The Raw Setlist Manifesto"

**Reference Target**: `raw_setlist_manifesto_ui_1792070255240.jpg`  
**Actual Build Screenshot**: `hero_notepad_1792126242637.png` & `chaos_view_1792126315602.png`  
**Date**: October 16, 2026  
**Status**: Critical Visual Realignment Required

---

## 1. Executive Verdict: Does the Current Website Come Close?

**Direct Answer: No. It does not come close yet.**

While the current website has functional components (sound synthesis, smooth scrolling, modal popups, audio triggers), visually it suffers from a fundamental design translation failure: **it translated an integrated, high-fashion brutalist collage into separate, generic web layout boxes.**

The reference mockup (`raw_setlist_manifesto_ui_1792070255240.jpg`) is an Awwwards-worthy, visceral art piece featuring:
1. **Colossal, compressed white typography** spanning the full screen height and width like a billboard.
2. An **interwoven 5-layer physical collage** (street flyer + neon poster + open spiral ring notebook + 35mm photo + silver gaffer tape + barcodes) physically layered *in front of and between* the giant letters.
3. A **tight panoramic lower strip** where the brutalist B&W flyer carousel and authentic double thermal receipts sit directly side-by-side in a single cohesive screen.

In contrast, our current implementation placed a stretched headline in green, shoved two separate boxes into a basic 2-column flexbox (one photo frame on the left, one yellow pad on the right with huge empty black space in between), and reused the old colorful web cards from the previous build.

---

## 2. Comprehensive 1-to-1 Discrepancy Breakdown

| Design Element | Reference Mockup (`raw_setlist_manifesto_ui.jpg`) | Current Website Build | Severity |
| :--- | :--- | :--- | :--- |
| **Backdrop Typography** | Massive, condensed, ultra-tall white grotesque (`Anton`/`Impact`/`Syne Condensed`) spanning edge-to-edge. `SAME SHIT. DIFFERENT` across top, `PEOPLE.` spanning bottom right. | Wide stretched green text `PEOPLE.` that scrolls awkwardly and gets clipped; separated from content. | 🔴 **Critical** |
| **Collage Composition** | **Overlapping 5-piece cluster**: Left flyer overlaps neon flyer; neon flyer overlaps spiral sketchbook; sketchbook overlaps 35mm stage photo with silver duct tape; neon tape & barcodes on top. | **2 isolated columns**: Photo card on left, legal pad on right, with wide empty void between them. Zero physical overlap or depth. | 🔴 **Critical** |
| **The Setlist Notebook** | Realistic **wire-o double-spiral open sketchbook** on bone paper with actual spiral punch holes, handwritten scribbles, arrows, crossed-out jokes (`SETLIST`, `Shanghe Note`, etc.). | Pale yellow legal-pad card with black table rows, generic badge tags, and green tape on top. Looks like a web table, not a comedian's sketchbook. | 🔴 **Critical** |
| **Posters Aesthetic** | **High-contrast zine / film noir flyers**: B&W film grain, bold brutalist typography, authentic street poster distress, one shocker neon lime poster (`SAME SHIT. PEOPLE.`), bottom tags (`VIRAL REEL VIEW 13.5K`). | Old colorful web cards retained from previous build (bright pink, cyan, orange, yellow cards with rounded borders). Looks like an app UI, not an underground gig wall. | 🔴 **Critical** |
| **Poster + Ticket Integration** | Panoramic bottom band: 5 poster cards on the left seamlessly flanking **2 real vertical thermal receipts** and a bold green CTA block (`TICKET RESERVATION / BUY NOW`) on the same horizon. | Split across separate distant sections: Poster carousel in Section 2, thermal receipt buried down in Section 4. | 🟠 **High** |
| **Physical Gaffer Tape & Stickers** | Textured silver gaffer tape holding photo, realistic white barcode stickers hanging off borders, neon green sticker tags (`SHIT.`, `JIMMY OYE`). | Flat CSS borders and solid green SVG polygons for tape. Lacks tactile realism and texture. | 🟠 **High** |
| **Header Navigation** | Minimalist high-fashion nav: `OFF-WHITE / ABOUT US / CONTACTS` on left, `JIMMY OYE` in center, `LOG IN / [DOWNLOAD / TICKETS]` in solid acid-lime pill on right. | Standard website navigation with extra links and dark sound toggle button. | 🟡 **Medium** |

---

## 3. Detailed Root Causes: Why Did This Happen?

1. **Failure of Layout Paradigm (Document Flow vs. Collage Artboard)**:
   - The reference mockup is conceived as an **artboard collage** where typography and physical artifacts share an overlapping coordinate space (`z-index` layering).
   - The code used standard CSS flow (`display: flex; flex-direction: row; justify-content: space-between`), which physically pushed the photo to the left edge and the notepad to the right edge, destroying the tight cluster composition.

2. **Font Selection & Letterform Proportion**:
   - The mockup uses an ultra-tall, condensed grotesque with 0 letter-spacing and 0.85 line-height so the letters tower vertically without overflowing horizontally.
   - The code used `Syne` with wide tracking and horizontal expansion, causing the words to blow past the viewport width and break.

3. **Asset Reuse instead of True Zine Reskinning**:
   - The bit cards in `WallCarousel.tsx` were still rendering the old colorful card borders (`accent` color tops, cartoonish badges) instead of the stark black-and-white street poster / newsprint zine aesthetic shown in the mockup.

---

## 4. The Exact Step-by-Step Remediation Plan

To bring the website to **100% visual fidelity** with `raw_setlist_manifesto_ui_1792070255240.jpg`, we must execute the following 5 concrete steps:

### Step 1: Re-architect the Hero into an Overlapping Collage Artboard
- **Colossal Kinetic Typography**:
  - Implement a dedicated background layer with `font-family: 'Anton', 'Impact', sans-serif` or condensed grotesque.
  - Line 1: `SAME SHIT. DIFFERENT` stretching 100vw across the top at ~14vw font size in stark white (`#FFFFFF`).
  - Line 2 (Bottom right): `PEOPLE.` at ~22vw font size in stark white.
- **The 5-Layer Collage Cluster** (centered and overlapping the typography):
  1. **Layer 1 (Left Flyer)**: Tilted `-6°`, black & white gig flyer with barcode sticker `12550 03059` hanging off the left edge, and green tape `SHIT.`.
  2. **Layer 2 (Neon Acid-Lime Flyer)**: Tilted `+3°`, vibrant `#CCFF00` halftone poster `JIMMY OYE TOUR` overlapping the right half of the left flyer.
  3. **Layer 3 (The Spiral Sketchbook Centerpiece)**: Open wire-o notebook with genuine metal ring binding graphics down the spine, bone-white paper texture, handwritten cursive/marker jokes, arrows, and interactive clickable bits.
  4. **Layer 4 (35mm Stage Photograph)**: B&W candid shot of Jimmy Oye holding the mic, overlapping the right page of the notebook, fastened at the top with realistic silver textured duct tape.
  5. **Layer 5 (Angled Decals & Barcodes)**: A second barcode sticker `12550 00551` across the photo corner, and a bright green duct-tape label `JIMMY OYE` angled across the top of `PEOPLE.`.

### Step 2: Redesign the Bit Posters into Film Noir / Zine Street Flyers
- Remove the bright pink/cyan/yellow app-card headers.
- Re-style every poster card in `WallCarousel.tsx` to match Card 1-5 in the mockup:
  - Deep photographic contrast (35mm B&W stage portraits).
  - Heavy typographic flyer headers (`SAME SHIT. DIFFERENT PEOPLE.` / `AUTHENTIC COMEDY`).
  - Dark cinematic film borders with bottom metadata badge: `[BIT TITLE] // VIRAL REEL VIEW • 14.2K`.
  - Include the signature neon acid-lime poster card (`SAME SHIT. PEOPLE.`) as a highlight shocker in the carousel.

### Step 3: Integrate the Lower Band (Poster Carousel + Thermal Reservation Side-by-Side)
- Right below the hero collage, render the subheader:
  - `INTERACTIVE OVERLAPPING POSTER WALL ────────── VIRAL REEL VIEW`
- Position the horizontal scrolling flyer cards side-by-side with the **Thermal Ticket Reservation Unit**:
  - Two vertical thermal receipts with authentic monospace dot-matrix receipt text, date/subtotal rows, and tear-away jagged bottoms.
  - Stacked brutalist reservation headline: `TICKET / RESERVATION / HOLIDAY`.
  - Two high-contrast CTA buttons: White `LEARN MORE` and solid neon acid-lime `BUY NOW`.

### Step 4: Refine the Header Navigation Bar
- Top-left: Spaced mono `OFF-WHITE // ARCHIVE // CONTACTS`.
- Center: Condensed bold `JIMMY OYE`.
- Top-right: `LOG IN` + solid acid-lime pill button `TICKETS ↗`.

### Step 5: Sound & Tactile Interaction Polish
- Maintain our synthesized Web Audio effects (crowd laugh, paper tear, mic click) hooked directly to the interactive elements (clicking posters, dragging the notebook, tearing the thermal ticket).

---

## 5. Visual Comparison Summary

```
MOCKUP GOAL (High-Fashion Zine Collage):
┌────────────────────────────────────────────────────────────────────────┐
│ OFF-WHITE  ABOUT US  CONTACTS          JIMMY OYE      LOG IN  [DOWNLOAD]│
│                                                                        │
│  S A M E   S H I T .   D I F F E R E N T                               │
│    ┌──────┐ ┌──────┐ ┌────────────────┐ ┌──────┐                       │
│    │ B&W  │ │ NEON │ │  WIRE-O SPIRAL │ │ 35MM │   P E O P L E .       │
│[B] │FLYER │ │POSTER│ │   SKETCHBOOK   │ │PHOTO │ [JIMMY OYE]           │
│    │      │ │      │ │  (SETLIST NOTE)│ │[TAPE]│                       │
│    └──────┘ └──────┘ └────────────────┘ └──────┘                       │
│────────────────────────────────────────────────── VIRAL REEL VIEW ────│
│ [POSTER 1] [POSTER 2] [POSTER 3] [NEON POSTER] [RECEIPT] [TICKETS CTA] │
└────────────────────────────────────────────────────────────────────────┘

CURRENT BUILD (Separated Flow Boxes):
┌────────────────────────────────────────────────────────────────────────┐
│ JO JIMMY OYE          Manifesto  Bits  Story  Tour  Book [Tickets] [🔊] │
│                                                                        │
│  P E O P L E . (Wide green stretched text)                             │
│                                                                        │
│   ┌────────────────────┐            ┌───────────────────────────────┐  │
│   │  Photo card        │            │  Yellow Legal Pad Table       │  │
│   │  (Isolated left)   │  [VOID]    │  (Isolated right)             │  │
│   │                    │            │                               │  │
│   └────────────────────┘            └───────────────────────────────┘  │
│                                                                        │
│  (Carousel, Soundboard, Receipts buried down in separate scroll tiers) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Conclusion & Recommendation

The diagnosis is clear: The current website has strong underlying functional foundations (Next.js, Lenis, Web Audio, GSAP), but the **visual art direction failed to honor the specific collage composition of the approved mockup**.

We should immediately execute the remediation blueprint above to restructure the Hero into the exact 5-layer overlapping collage, replace the poster styling with the film noir / zine flyers, and bring the thermal receipt reservation unit into the panoramic lower band.
