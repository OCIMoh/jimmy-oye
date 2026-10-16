# Walkthrough: Layout Refinements & 1:1 Visual Alignment

**Reference Target**: `raw_setlist_manifesto_ui_1792070255240.jpg`  
**Audit Document**: [discussion.md](file:///d:/projects/jimmy-oye-bit-poster-wall-full-with-git-20261015-112242/discussion.md)  
**Approved Plan**: [plan.md](file:///d:/projects/jimmy-oye-bit-poster-wall-full-with-git-20261015-112242/plan.md)  
**Status**: 100% Implemented & Verified in Browser

---

## 1. What Changed in this Iteration

### A. Spread Hero Collage & Uncovered `PEOPLE.`
- **Problem**: The 4 hero collage items were horizontally bunched up in the center-right, squishing the 35mm photo directly over `PEOPLE.` and leaving an unintended 150px gap above the navbar.
- **Fix**:
  1. Fixed the 150px gap: Added `position: fixed; inset: 0; pointer-events: none;` to `.film-grain`, docking `<header className="manifesto-nav">` flush at `top: 0`.
  2. Spread out the 4 hero collage items across 0% to 71% of container width:
     - **Artifact 1 (B&W flyer)**: `left: 2%`, `width: 185px`, tilted `-5.5°` with hanging barcode.
     - **Artifact 2 (Neon poster)**: `left: 15%`, `width: 175px`, tilted `+2.8°` with halftone photo.
     - **Artifact 3 (Wire-O sketchbook)**: `left: 29%`, `width: 320px`, height `380px`, realistic metallic loops and setlist notes.
     - **Artifact 4 (35mm Stage photo)**: Moved leftward to `left: 54%`, `width: 200px`, height `260px`, ending at ~71% width.
     - **Right ~29% of Stage**: Completely open and unobstructed, allowing the giant billboard word `PEOPLE.` to tower cleanly.
     - **Angled Brand Tape**: Positioned at `left: 70%; top: 38%` angled across the `P` of `PEOPLE.` exactly as in the visual reference.
  3. Optimized viewport height: Stage height adjusted to `480px`, so at 1366×633 desktop resolutions, the `INTERACTIVE OVERLAPPING POSTER WALL` header peeks cleanly at the bottom of the fold, inviting exploration without clipping.

### B. Decoupled Ticket Reservation from Carousel
- **Problem**: In Section 2, the horizontal carousel contained both 21 comedy bit routines AND the reservation desk side-by-side, causing horizontal crampedness.
- **Fix**:
  1. [WallCarousel.tsx](file:///d:/projects/jimmy-oye-bit-poster-wall-full-with-git-20261015-112242/components/WallCarousel.tsx) is now **100% dedicated to all 21 comedy routines** full-width, with the `[CHAOS (FLYER WALL)]` vs `[GRID (CONTACT SHEET)]` mode toggle and signature neon acid-lime shocker poster every 5th card.
  2. The Ticket Reservation desk was elevated to **Section 4** ([ThermalReceiptTour.tsx](file:///d:/projects/jimmy-oye-bit-poster-wall-full-with-git-20261015-112242/components/ThermalReceiptTour.tsx)) into a grand dedicated two-column stage:
     - **Left Column**: Dual authentic thermal receipt stubs with realistic calculations, barcode stubs, and jagged zigzag tear edges, accompanied by the towering headline `TICKET RESERVATION HOLIDAY` and high-contrast `LEARN MORE` and `BUY NOW` buttons.
     - **Right Column**: Continuous thermal receipt tour schedule roll featuring 6 tour passes (Chandigarh, Mohali, Delhi NCR, Bengaluru, Mumbai, Pune), perforation tear lines, live ticket status badges, and booking actions.

---

## 2. Visual Proofs & Verification

### Hero Section (Clean Top Viewport)
![Hero Section Clean Viewport](file:///C:/Users/User/.gemini/antigravity-ide/brain/0702b1ef-1b48-48da-b17e-12dac42fa24b/hero_clean_top_viewport_1792131672270.png)
*Navbar pinned at top, artifacts spread across left 70%, `PEOPLE.` towering cleanly on right, section 2 subheader peeking at the fold.*

### Panoramic Full-Width Poster Wall Carousel
![Panoramic Poster Wall](file:///C:/Users/User/.gemini/antigravity-ide/brain/0702b1ef-1b48-48da-b17e-12dac42fa24b/poster_wall_carousel_1792130407404.png)
*Full-width panoramic strip displaying all comedy routines with film noir grain, view counts, and signature neon shockers.*

### Dedicated Ticket Reservation & Continuous Tour Manifest
![Ticket Reservation Stage](file:///C:/Users/User/.gemini/antigravity-ide/brain/0702b1ef-1b48-48da-b17e-12dac42fa24b/ticket_reservation_stage_1792130418454.png)
*Side-by-side brutalist stage with dual thermal receipt stubs on the left and the continuous tour manifest on the right.*

---

## 3. Technical Verification
- **TypeScript (`npx tsc --noEmit`)**: Clean build with **0 errors**.
- **Dev Server**: Running on `http://localhost:3000`.

