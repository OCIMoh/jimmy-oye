# Implementation Plan: 1:1 Visual Alignment with "The Raw Setlist Manifesto" Mockup

> **Target Reference**: `raw_setlist_manifesto_ui_1792070255240.jpg`  
> **Audit Reference**: `discussion.md`  
> **Goal**: Restructure the web app from separated flexbox containers into a true artboard collage that replicates the composition, typography, textures, and density of the approved mockup with 100% visual fidelity.

---

## 1. Architecture & Design Direction

### Visual Composition Blueprint
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ OFF-WHITE  ABOUT US  CONTACTS                 JIMMY OYE               LOG IN  [DOWNLOAD]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   S A M E   S H I T .   D I F F E R E N T                                              │
│                                                                                        │
│     ┌─────────┐   ┌─────────┐   ┌───────────────────────────┐   ┌─────────┐            │
│     │ B&W     │   │ NEON    │   │ ◖◗ WIRE-O SPIRAL NOTEBOOK │   │ 35MM    │            │
│     │ GIG     │   │ TOUR    │   │ ◖◗ SETLIST                │   │ FILM    │ PEOPLE.   │
│ [B] │ FLYER   │   │ POSTER  │   │ ◖◗ • 4am Uber             │   │ PHOTO   │[JIMMY OYE] │
│     │ (TILT -)│   │ (TILT +)│   │ ◖◗ • Matches   (Notes ↗)  │   │ [TAPE]  │            │
│     └─────────┘   └─────────┘   └───────────────────────────┘   └─────────┘            │
│                                                                                        │
├─────────────────────────────────────────────────────────────────── VIRAL REEL VIEW ────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ ┌───────┐ ┌────────────────┐ │
│ │ POSTER1 │ │ POSTER2 │ │ POSTER3 │ │ POSTER4 │ │ NEON  │ │THERMAL│ │ TICKET         │ │
│ │ B&W ZINE│ │ 35MM    │ │ CUTOUT  │ │ STAGE   │ │ POSTER│ │RECEIPT│ │ RESERVATION    │ │
│ │ 13.5K   │ │ 12.3K   │ │ 15.3K   │ │ 12.3K   │ │ LIME  │ │TICKETS│ │ [BUY NOW]      │ │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └───────┘ └───────┘ └────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. User Review Required

> [!IMPORTANT]
> **Typography Shift for Billboard Backdrop**:
> To achieve the towering, compressed letterforms shown in `raw_setlist_manifesto_ui_1792070255240.jpg`, we will load Google Fonts `Anton` (or `Bebas Neue`) alongside `Caveat` (for authentic handwritten setlist notes and arrows in the spiral notebook).

> [!NOTE]
> **Section Hierarchy Optimization**:
> The primary viewport above the fold will faithfully reproduce the reference mockup (Top Nav + Colossal Backdrop + 5-Layer Overlapping Collage + Panoramic Poster Wall & Thermal Reservation unit). The interactive deep-dive sections (Punchline Soundboard with Live LED Teleprompter, Detailed Tour Schedule, and Greenroom Terminal) will follow cleanly beneath the panoramic fold.

---

## 3. Proposed Changes Grouped by Component

---

### Phase 1: Typography & Asset Foundation

#### [MODIFY] `app/layout.tsx`
- Add Google Fonts links for:
  - `Anton` (condensed billboard typography for `SAME SHIT. DIFFERENT PEOPLE.`)
  - `Caveat` (authentic organic handwritten comedian notebook cursive and arrows)
  - `Space Mono` (receipts, barcodes, and brutalist metadata)
  - `Space Grotesk` & `Syne` (editorial headings and badges)

```tsx
<link
  href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Caveat:wght@600;700&family=Space+Grotesk:wght@400;500;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800;900&display=swap"
  rel="stylesheet"
/>
```

---

### Phase 2: The Colossal Billboard Backdrop & Navigation

#### [MODIFY] `components/PosterWall.tsx`
- Re-architect the Hero into an artboard collage:
  - **Minimalist Header**: Left (`OFF-WHITE // ABOUT US // CONTACTS`), Center (`JIMMY OYE`), Right (`LOG IN` + solid lime pill `DOWNLOAD` / `TICKETS ↗` + audio indicator).
  - **Backdrop Giant Letters**:
    - Line 1 (Upper Span): `SAME SHIT. DIFFERENT` using `font-family: var(--font-billboard, 'Anton', sans-serif); font-size: clamp(4.5rem, 13.5vw, 15rem); color: #FFFFFF; letter-spacing: -0.02em; line-height: 0.85;`.
    - Line 2 (Bottom Right): `PEOPLE.` spanning the bottom right quadrant at `clamp(6rem, 20vw, 22rem)`.
  - **Centering Container**: Holds the 5-layer overlapping collage cluster, overlapping both text lines with authentic `z-index` staging.

---

### Phase 3: The 5-Layer Overlapping Physical Collage

#### [NEW] `components/HeroCollage.tsx`
Create a dedicated component managing the exact 5 overlapping artifacts with realistic physical properties, tilt transforms, drop shadows, and interactive gestures:

1. **Artifact 1: Street Gig Flyer (Far Left)**
   - Distressed monochrome flyer: `SIMMY OYE. DIFFERENT PEOPLE. AUTHENTIC STANDUP COMEDY.`
   - Rotation: `-5.5deg`, subtle paper texture, folded distress line.
   - Accents: Vertical barcode sticker `12550 03059` hanging off the left edge, and neon green tape label `SHIT.`.
2. **Artifact 2: Neon Acid-Lime Tour Poster (Mid-Left)**
   - Vibrant `#CCFF00` background with halftone rasterized portrait of Jimmy Oye.
   - Text: `JIMMY OYE TOUR // AUTHENTIC STANDUP`.
   - Rotation: `+2.8deg`, overlapping the right half of Artifact 1.
3. **Artifact 3: Wire-O Double-Spiral Open Sketchbook (Centerpiece)**
   - Authentic spiral notebook format:
     - Left edge has double-wire metal binding loops (`svg` rings).
     - Ruled paper background (`repeating-linear-gradient` with bone `#F7F5F0`).
     - Handwritten title: `SETLIST` in marker font (`Caveat`).
     - Scribbled routine names: `• 4am Uber`, `• Matches`, `• The Bill`, `• Silence`, crossed-out lines, and arrows (`Shanghe note -> Jokes hot`).
     - Clickable routines that smooth-scroll to and open bits.
4. **Artifact 4: Candid 35mm Stage Photograph (Center-Right)**
   - Authentic B&W photograph of Jimmy Oye speaking into the dynamic microphone on stage.
   - Rotation: `-1.5deg`, overlapping the right page of the spiral sketchbook.
   - Heavy textured silver duct tape holding the top edge to the "wall".
5. **Artifact 5: Decals, Barcodes & Angled Neon Tape**
   - Barcode label `12550 00551` affixed to the lower right corner of the stage photo.
   - Bright neon acid-lime duct-tape strip reading `JIMMY OYE` angled across the top edge of `PEOPLE.`.

---

### Phase 4: Panoramic Lower Band (Poster Carousel + Thermal Reservation Side-by-Side)

#### [MODIFY] `components/WallCarousel.tsx`
- Re-skin poster cards from colorful SaaS-like cards to **gritty film noir / zine street posters**:
  - Deep black & white film-grain portraits.
  - Bold distressed typography headers: `SAME SHIT. DIFFERENT PEOPLE.` / `STANDUP SPECIAL`.
  - Dark film border with bottom meta pills: `[BIT TITLE] // VIRAL REEL VIEW • 13.5K`.
  - Signature neon shocker card: Card 5 styled in vibrant acid-lime `#CCFF00` with heavy black gothic lettering: `SAME SHIT. PEOPLE.`.
- **Side-by-Side Thermal Ticket Reservation Unit**:
  - Directly appended to the right side of the poster strip on the same panoramic horizontal plane:
    - **Thermal Receipt 1**: Continuous thermal paper texture, monospace dot-matrix receipt text (`THERMAL RECEIPT`, `Total Date: 1:30 PM`, `Endo: Sep 2023`, `Subtliat: 1.60`, `Ticket to soon`, jagged tear bottom, barcode).
    - **Thermal Receipt 2**: Smaller perforated receipt stub with barcode.
    - **Reservation Call to Action Block**:
      - Stacked heavy typography: `TICKET / RESERVATION / HOLIDAY`.
      - High-contrast buttons: White `LEARN MORE` and solid neon acid-lime `BUY NOW`.

---

### Phase 5: Deepening the Lower Showcase Sections

#### [MODIFY] `components/PosterWall.tsx`
- Seamlessly transition from the panoramic hero frame down into:
  - **Section 2**: Punchline Soundboard & LED Teleprompter (Jimmy's DJ sub-plot and interactive audio triggers).
  - **Section 3**: Full Tour Dates schedule with tear-away perforated tickets.
  - **Section 4**: The Greenroom Booking Terminal and velocity ticker marquees.

---

### Phase 6: Design System CSS Overhaul

#### [MODIFY] `app/globals.css`
- Implement tokens:
  - `--font-billboard: 'Anton', 'Bebas Neue', sans-serif;`
  - `--font-handwritten: 'Caveat', cursive;`
  - `--font-mono: 'Space Mono', monospace;`
  - `--neon-lime: #CCFF00;`
  - `--paper-bone: #F7F5F0;`
  - `--tape-silver: #A8A8A8;`
- Exact styling for:
  - `.billboard-text`
  - `.hero-collage-cluster`
  - `.wire-o-spiral-notebook`
  - `.zine-poster-card`
  - `.thermal-reservation-block`
  - `.silver-gaffer-tape`

---

## 4. Verification Plan

### Automated Verification
```powershell
# 1. Type checking
npx tsc --noEmit

# 2. Production build verification
npm run build
```

### Manual & Visual Verification via Browser Subagent
1. **Hero Frame (Above the fold)**:
   - Verify `SAME SHIT. DIFFERENT` stretches across the top in compressed white letters.
   - Verify the 5-layer physical collage overlaps properly without weird layout breaks.
   - Verify the spiral notebook has visible wire loops, ruled lines, and handwritten notes.
   - Verify the 35mm photo has silver gaffer tape and barcode `12550 00551`.
   - Verify `PEOPLE.` anchors the bottom right behind the neon `JIMMY OYE` tape.
2. **Panoramic Lower Band**:
   - Verify the 5 zine poster cards match the black-and-white gritty aesthetic with the neon green card shocker.
   - Verify the 2 thermal receipts and `TICKET RESERVATION / BUY NOW` buttons sit right next to the poster cards on the same horizontal line.
3. **Interactive Gestures & Audio**:
   - Verify clicking posters opens the full inspection modal.
   - Verify clicking `BUY NOW` or ticket stubs plays paper tear / mic click sound effects and triggers reservation drawer.
   - Verify scrolling smoothly down reveals the soundboard, tour dates, and terminal.
