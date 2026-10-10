# BookIt — Design System & Visual Specification

## 1. Palette (Curated & Named Hex Tokens)

BookIt avoids generic SaaS colors and neon washes in favor of earthy, deep-toned boutique hospitality colors:

| Token Name | Hex Code | Role |
|---|---|---|
| **Chalk** | `#F5F7F6` | Cool off-white primary canvas, background wash, airy negative space |
| **Lagoon** | `#0F2B2E` | Deep teal-ink primary text, high-contrast dark surfaces, header ink |
| **Tide** | `#1F6F78` | Oceanic secondary ink, links, active tab indicator, selected calendar dates |
| **Marigold** | `#F2B33D` | Warm golden accent, key action badges, star rating highlight |
| **Signal** | `#D9482B` | Terracotta cinnabar alert, "2 rooms left" scarcity indicator, destructive actions |
| **Stone** | `#D6DCD9` | Hairline borders, subtle dividers, muted structural outlines |
| **Sand** | `#EBEFEA` | Secondary component background, input fill, pill active tint |

*(Dark surfaces in admin invert into Lagoon `#0F2B2E` backdrop with Stone `#D6DCD9` structural hairlines and Chalk `#F5F7F6` text).*

---

## 2. Typography & Hierarchy

### Typefaces
- **Primary / UI / Headings:** `Bricolage Grotesque` (variable weight, humanistic editorial character, compact numerals, sharp punctuation).
- **Long-Form / Editorial / Reviews:** `Newsreader` (transitional serif, optical sizing, elegant reading rhythm for property stories and policies).
- **Tabular Figures:** Applied systematically with `font-variant-numeric: tabular-nums` for room rates, dates, counters, and tape-chart grids.

### Type Scale
- `display`: `2.75rem` (44px) / `1.1` line-height / Weight: 700 / Tracking: -0.02em
- `h1`: `2.00rem` (32px) / `1.2` line-height / Weight: 600 / Tracking: -0.015em
- `h2`: `1.50rem` (24px) / `1.25` line-height / Weight: 600 / Tracking: -0.01em
- `h3`: `1.25rem` (20px) / `1.3` line-height / Weight: 600 / Tracking: 0
- `body-lg`: `1.0625rem` (17px) / `1.5` line-height / Weight: 400
- `body`: `0.9375rem` (15px) / `1.5` line-height / Weight: 400
- `caption`: `0.8125rem` (13px) / `1.4` line-height / Weight: 500 / Tracking: 0.01em
- `micro`: `0.6875rem` (11px) / `1.3` line-height / Weight: 600 / Tracking: 0.02em

---

## 3. Layout Concept & Wireframes

### Architectural Alignment Rules
- **Grid:** 12-column responsive fluid grid with max-width `1280px` on desktop; `24px` gutter (`16px` on mobile).
- **Hairlines:** Thin `1px solid var(--color-stone)` borders rather than floating drop-shadowed card boxes.
- **Radius:** Restrained `6px` on inputs and buttons, `8px` on dialogs and popovers. Zero radius on architectural photography for an authentic gallery aesthetic.

### Key Screen Layouts & Wireframes

#### Screen A: Home (`/`)
*Concept:* The hero IS the interactive sentence search, immediately above the real-time "Open tonight" showcase.
```text
+-----------------------------------------------------------------------+
|  [Logo: BookIt]          Udaipur  *  Goa  *  Kerala       [My Bookings] [Login] |
+-----------------------------------------------------------------------+
|                                                                       |
|   Stay in [ Udaipur, RJ  v ] from [ 14 Oct  v ] to [ 17 Oct  v ]      |
|   for [ 2 Guests  v ] .                             [ Search Stays ]  |
|                                                                       |
+-----------------------------------------------------------------------+
|   * Open Tonight (Rooms available right now)                          |
|   +-------------------+  +-------------------+  +-------------------+ |
|   | [Photo]           |  | [Photo]           |  | [Photo]           | |
|   | Rawla Narlai      |  | Fort Tiracol      |  | Old Harbour Hotel | |
|   | Udaipur - 2 left  |  | Goa - 1 left      |  | Kochi - 3 left    | |
|   | ₹12,400 / night   |  | ₹9,800 / night    |  | ₹14,200 / night   | |
|   +-------------------+  +-------------------+  +-------------------+ |
+-----------------------------------------------------------------------+
```

#### Screen B: Property Detail (`/hotels/:slug`)
*Concept:* Asymmetric photo mosaic, live "N left" room tiers, interactive calendar, sticky quote & hold drawer.
```text
+-----------------------------------------------------------------------+
|  <- All Stays  |  Fateh Garh - Udaipur, Rajasthan        [Save] [Share] |
+------------------------------------+----------------------------------+
|  +-------------------------------+  |  +--------------+ +--------------+ |
|  |                               |  |  | Photo 2      | | Photo 3      | |
|  |  Hero Photo                   |  |  +--------------+ +--------------+ |
|  |  (Asymmetric mosaic)          |  |  +--------------+ +--------------+ |
|  |                               |  |  | Photo 4      | | Photo 5 (+8) | |
|  +-------------------------------+  |  +--------------+ +--------------+ |
+------------------------------------+----------------------------------+
|  STAY DETAILS & ROOM TYPES          |  STICKY BOOKING PANEL           |
|  - Heritage Suite (2 units left)   |  Check-in: 14 Oct  Out: 17 Oct  |
|    ₹14,500 / night                 |  Guests: 2 adults                |
|  - Palace View Room (Sold out)     |  Selected: Heritage Suite        |
|                                    |  Subtotal (3 nights): ₹43,500   |
|  AVAILABILITY CALENDAR             |  Taxes & GST (18%):   ₹7,830    |
|  [ Live Month Grid with rates ]    |  Total:              ₹51,330    |
|                                    |  [ Hold Room (10 min timer) ]   |
+------------------------------------+----------------------------------+
```

#### Screen C: Admin Tape Chart (`/admin/tape-chart`)
*Concept:* Utilitarian multi-room front-desk grid updating in real-time via Socket.io.
```text
+-----------------------------------------------------------------------+
| BookIt Admin | [Overview] [Tape Chart] [Bookings] [Rooms] [Audit]     |
+-----------------------------------------------------------------------+
| Hotel: [Fateh Garh v]   Month: [October 2026 v]   [+ Walk-In Booking] |
+-----------+--------+--------+--------+--------+--------+--------+-----+
| Room      | 14 Wed | 15 Thu | 16 Fri | 17 Sat | 18 Sun | 19 Mon | ... |
+-----------+--------+--------+--------+--------+--------+--------+-----+
| 101 Dlx   | [=== BK-7H2K9Q (Sharma) ===]      | Free   | Free   |     |
| 102 Dlx   | Free   | [======= BK-92B1X (Verma) ======] | Maint. |     |
| 201 Ste   | [=========== Blocked: Renovation ===========]       |     |
| 202 Ste   | Free   | Free   | [== BK-33A8Z ==]         | Free   |     |
+-----------+--------+--------+--------+--------+--------+--------+-----+
```

---

## 4. Principles & Brand Identity

1. **Quiet Luxury & Precision:** Uncluttered, razor-sharp typography, authentic architectural photography, zero gimmicky animations.
2. **Tactile Confidence:** Every action provides immediate feedback; scarcity markers ("2 left") are truthful and powered by the live ledger.
3. **Restrained Motion:** Transitions only answer user actions (popover reveals, drawer slides, countdown ticks, tape chart live updates).

---

## 5. Review Against "Defaults to Avoid" (A8 Compliance)

| Default to Avoid | How BookIt Avoids It & What Was Chosen Instead |
|---|---|
| **Purple/blue gradient washes & neon glows** | Strict natural palette: Chalk `#F5F7F6`, deep Lagoon ink `#0F2B2E`, Tide `#1F6F78`, warm Marigold `#F2B33D`. No linear gradients. |
| **Identical soft-shadow rounded cards** | Structured hairline Stone borders (`1px solid #D6DCD9`), sharp architectural photos with `0px` radius, crisp `6px` controls. |
| **Centered hero with generic marketing slogans** | Replaced entirely with the **Sentence Search** engine: an inline, keyboard-accessible sentence form that controls instant live queries. |
| **Numbered 01/02/03 badges & arrows on every link** | Clean semantic hierarchy, plain active action verbs ("Search stays", "Hold room", "Review policies"). |
| **Emojis as icons & mixed icon sets** | Unified Lucide icon system with standard 1.75px stroke width throughout. Zero emojis in the UI. |
| **Stock shadcn/Tailwind look** | Built with custom CSS Modules and native design tokens (`tokens.css`). No default Tailwind zinc/slate styles. |
| **Fake social proof & invented counts** | Strictly banned. Viewers counter only displays when 2+ real connected sockets inhabit the hotel room; scarcity comes from Mongo `RoomNight` index counts. |
