---
name: design-system
description: >-
  Authoritative design system specifications, color tokens, typography, component patterns,
  Tailwind utility standards, accessibility rules, and enforcement checklists for generic-map-with-pois.
---

# Skill: Design System & UI Style Guide

## When to Use This Skill
Use this skill whenever authoring, updating, reviewing, or refactoring UI components, styling layouts with Tailwind CSS, creating modals/controls/buttons, or ensuring visual and accessibility consistency across `generic-map-with-pois`.

---

## 1. Design Philosophy & Visual Language

`generic-map-with-pois` is a high-performance, geospatial dashboard. The core principles of its visual design are:
1. **Map-First Spatial Context**: The interactive Leaflet map serves as the primary canvas. UI components float unobtrusively above it or dock cleanly into responsive drawers without cluttering spatial information.
2. **Tactile & High-Contrast Controls**: Map controls and overlay cards feature crisp, semi-opaque borders (`border-[2px] border-gray-800/50`), clean white surfaces, and deliberate hover/focus states for instant affordance.
3. **Restrained, Purpose-Driven Palette**: Neutral grays form the foundation. Accent colors are reserved strictly for semantic actions (Blue for primary navigation/selection, Green for exports/downloads, Dark Gray for active filters/toggles).
4. **Predictable Typography & Spacing**: Strict modular scale for typography and standardized paddings ensure visual rhythm from atomic buttons to full-page layouts.

---

## 2. Design Tokens & Palette

### 2.1 Color Tokens

| Token Category | Tailwind Classes | Hex / Value | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas / Background** | `bg-gray-100` | `#F3F4F6` | Split-view container, list view drawer background |
| **Elevated Surface** | `bg-white` | `#FFFFFF` | Cards, modals, drawers, floating control buttons |
| **Overlay / Backdrop** | `bg-gray-900 opacity-50` | `rgba(17, 24, 39, 0.5)` | Modal and drawer backdrop overlay |
| **Primary Text** | `text-gray-900` | `#111827` | Primary headings (`h1`, `h2`, POI title in drawer) |
| **Secondary Headings** | `text-gray-800` | `#1F2937` | Section headers (`h3`), select values, input text |
| **Body Text** | `text-gray-700` | `#374151` | General body copy, POI descriptions, modal details |
| **Subtle / Form Labels** | `text-gray-600` | `#4B5563` | Form field labels, secondary metadata captions |
| **Muted Text / Units** | `text-gray-500`, `text-gray-400` | `#6B7280`, `#9CA3AF` | Filter units, count badges, placeholder text |
| **Inverted Text** | `text-white` | `#FFFFFF` | Text on dark buttons, active pills, badges, tooltips |
| **Primary Accent (Action)** | `bg-blue-600`, `hover:bg-blue-700` | `#2563EB` | Shareable link button, primary action, link color |
| **Primary Ring Focus** | `focus:ring-blue-500` | `#3B82F6` | Focus outlines for primary action buttons |
| **Success / Export Accent** | `bg-green-600`, `hover:bg-green-700` | `#059669` | Download PDF button, active toggles |
| **Success Ring Focus** | `focus:ring-green-500` | `#10B981` | Focus outlines for export/generate buttons |
| **Dark Neutral Accent** | `bg-gray-800`, `hover:bg-gray-700` | `#1F2937` | Active filter pills, tooltips, dark buttons, active badges |
| **Dark Neutral Focus** | `focus:ring-gray-800` | `#1F2937` | Focus outlines for dark buttons, pills, inputs |
| **Error / Alert Accent** | `border-red-300 bg-red-50 text-red-800` | `#991B1B` | Error alerts and failed load states |

### 2.2 Map Marker Colors (`MARKER_COLORS` in `src/constants.ts`)

| Marker Color | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| `MARKER_COLORS.blue` | `#3B82F6` | Default POI location marker |
| `MARKER_COLORS.green` | `#10B981` | POIs with multi-line/complex descriptive data |
| `MARKER_COLORS.red` | `#DC2626` | High-priority or specialized POI pins |

---

## 3. Typography Hierarchy

Use standard Tailwind font stacks (`font-sans`). Never use raw arbitrary font sizes.

| Role | Tailwind Classes | Element / Context |
| :--- | :--- | :--- |
| **POI Title (Drawer)** | `text-xl font-bold text-gray-900` | `RecordDetails.tsx` main heading |
| **Modal / Section Title** | `text-base font-semibold text-gray-800` | `Modal.tsx`, `MapControls.tsx` headers |
| **Card & Trigger Title** | `text-sm font-medium text-gray-800` | `Select.tsx`, `FilterAccordion.tsx` trigger |
| **Body Text** | `text-sm text-gray-700 leading-relaxed` | Paragraphs, list items, description text |
| **Interactive Links** | `text-blue-600 underline hover:text-blue-800` | URLs and emails parsed via `linkifyText.tsx` |
| **Control Labels / Units** | `text-xs font-semibold text-gray-800` | `NumericRangeFilter.tsx` header, units in `text-gray-500` |
| **Buttons & Badges** | `text-xs font-medium` | `PillButton.tsx`, action buttons, badge counts |
| **Tooltip Copy** | `text-xs font-medium text-white` | `PlainTooltip.tsx` text bubble |

---

## 4. Spacing, Margins & Padding (Standard 4px Scale)

All margins, paddings, and positional offsets follow Tailwind's standard 4-pixel grid (`1` = 4px, `2` = 8px, `3` = 12px, `4` = 16px). Arbitrary pixel margins (e.g. `10px`, `50px`) are strictly prohibited.

### 4.1 Viewport Overlay Offsets
Floating UI elements situated over the map must share uniform coordinate offsets:
- **Top-Left Controls (`MapControls`)**: `top-3 left-3` (12px offset from viewport edges). Stacking gap between button groups: `gap-2` (8px).
- **Top-Right Search & Filters (`SearchSection`)**: `top-3 right-3` (12px offset from viewport edges). Stacking gap between stacked controls: `gap-2` (8px). Max width constraint: `max-w-[calc(100%-4.5rem)]` to safeguard against collision with map controls on mobile.
- **Split-View Toggle**: `left-3 -top-10` (12px horizontal offset, aligned with `MapControls`).

### 4.2 Containers, Panels & Cards
- **Drawers (`Drawer.tsx`)**: No outer padding (`p-0`). Inner scrollable container: `p-4 pr-12` (16px content padding with 48px right clearance for the top-right close button).
- **Modals (`Modal.tsx`)**: Outer viewport padding: `p-3` (12px buffer on small devices). Inner scroll container: `p-4 pr-12` (16px content padding with right clearance).
- **POI Details (`RecordDetails.tsx`)**: Component root has `p-0` (no outer padding or forced bottom margin); spacing is strictly managed by parent panel or card (`p-4`).
- **List View Grid (`ListView.tsx`)**: Container padding `p-4` (16px), grid gap `gap-4` (16px), card padding `p-4` (16px), pagination button `px-4 py-2` (16px x 8px).

### 4.3 Form Controls & Density Alignment
To maintain horizontal and vertical alignment when controls are stacked in `SearchSection`:
- **Search Field (`SearchField.tsx`)**: `py-1.5 pl-8 pr-8 text-sm leading-5` (Search icon `pl-2.5`, clear icon `pr-2.5`).
- **Select Dropdown (`Select.tsx`)**: Trigger `py-1.5 pl-3 pr-3 text-sm leading-5`. Options `px-2 py-1.5 text-xs`.
- **Filter Accordion (`FilterAccordion.tsx`)**: Trigger `py-1.5 pl-3 pr-3 text-sm leading-5`. Body `p-3 space-y-3`. Clear button `px-3 py-1.5 text-xs rounded-md`.
- **Range Inputs (`NumericRangeFilter.tsx`)**: Inputs `px-2 py-1 text-xs`, gap `gap-2`.
- **Semantic Action Buttons**: `px-3 py-1.5 text-xs font-medium` (Download PDF, Copy Link).
- **Category Filter Pills (`PillButton.tsx`)**: `px-2.5 py-1 text-xs font-medium`.
- **Map Control Buttons (`Button.tsx`)**: `min-h-[32px] min-w-[32px] p-[2px]` (32px = 8 * 4px standard).

---

## 5. Elevation, Borders & Z-Index Layering

### 5.1 Border Radii
- **Form Controls & Action Buttons**: `rounded-md` (6px - inputs, buttons, dropdown triggers, range sliders).
- **Cards, Modals & Containers**: `rounded-lg` (8px - drawer, modal dialog, POI list cards).
- **Pills, Badges & Toggles**: `rounded-full` (active filter pills, counter badges, checkbox sliders).

### 5.2 Borders, Strokes & Background Clipping
- **Floating Map Overlay Triggers**: `border-[2px] border-gray-800 border-opacity-50 bg-white bg-clip-padding` (or modern `border-gray-800/50`).
- **Background Clipping (`bg-clip-padding`)**: Mandatory on all bordered interactive elements (buttons, inputs, selects, cards). Prevents hover backgrounds (`hover:bg-gray-100`) from bleeding underneath semi-transparent borders and corrupting border color/sharpness.
- **Inner Corner Radius Geometry**: When child buttons sit inside a bordered parent (such as `ButtonGroup`), child button corners must use inner radius $R_{\text{inner}} = R_{\text{outer}} - \text{border}$ ($6\text{px} - 2\text{px} = 4\text{px}$, Tailwind `rounded-[4px]`), preventing square hover backgrounds from leaking past rounded parent borders.
- **Dividers & Structural Borders**: `border-b border-gray-200` or `border border-gray-200`.
- **Inactive Form Elements**: `border border-gray-300 bg-white bg-clip-padding hover:border-gray-500`.

### 5.3 Z-Index Hierarchy
Adhere strictly to this layering order to prevent clipping or stacking conflicts:

| Layer | Z-Index | Components |
| :--- | :--- | :--- |
| **Map Base** | `z-0` | Leaflet tile layer, marker clusters, marker canvas |
| **In-Component Dropdowns**| `z-50` | `Select.tsx` option listbox |
| **Floating Overlays** | `z-[998]` | `MapControls.tsx`, `SearchSection.tsx`, `ButtonGroup.tsx`, split view toggle |
| **Drawers & Modals** | `z-[999]` | `Modal.tsx`, `Drawer.tsx`, `Backdrop.tsx` |
| **Viewer Backdrop** | `z-[9998]` | `ImageGallery.tsx` fullscreen modal backdrop |
| **Viewer Modal Lightbox**| `z-[9999]` | `ImageGallery.tsx` full-resolution image container |

---

## 6. Standard Component Patterns

### 6.1 Buttons

1. **Map Control Icon Buttons**:
   - Nest inside `<ButtonGroup>`.
   - Use `<ButtonWithTooltip variant="transparent" ... icon={<IconSVG width={15} height={15} />} />`.
   - Dimensions: `min-h-[32px] min-w-[32px] p-[2px] text-2xl leading-5`.
2. **Compact Action Buttons (Semantic)**:
   - Structure: `inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1`.
   - Action icon size: `mr-1.5 h-3.5 w-3.5`.
   - Primary: `bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`.
   - Export: `bg-green-600 hover:bg-green-700 focus:ring-green-500`.
   - Neutral Dark: `bg-gray-800 hover:bg-gray-700 focus:ring-gray-800` (used for "Show more" or general actions).
3. **Pill Buttons (Category / Filter Toggles)**:
   - Base: `inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-1`.
   - Active: `border-gray-800 bg-gray-800 text-white shadow-sm`.
   - Inactive: `border-gray-300 bg-white text-gray-700 hover:border-gray-500 hover:bg-gray-50`.

### 6.2 Input & Select Controls

1. **Search Input**:
   - Container: `relative`.
   - Input: `w-full rounded-md border-[2px] border-gray-800/50 bg-white py-1.5 pl-8 pr-8 text-sm leading-5 hover:bg-gray-100 focus:border-gray-800 focus:outline-none`.
   - Icons: Left search icon (`fill-gray-800`, 20px, `pl-2.5`), right clear icon on active query (`pr-2.5`).
2. **Select & Accordion Triggers**:
   - Trigger: `flex w-full cursor-pointer items-center justify-between rounded-md border-[2px] border-gray-800/50 bg-white py-1.5 pl-3 pr-3 text-sm leading-5 text-gray-800 hover:bg-gray-100 focus:border-gray-800 focus:outline-none`.
   - Chevron: `transition-transform duration-200`, rotates 180° when open (`rotate-180`).
   - Dropdown Body: `rounded-md border-[2px] border-gray-800/50 bg-white p-1 shadow-md`.

### 6.3 Modals & Drawers

1. **Backdrop**:
   - `fixed inset-0 z-[998] bg-gray-900 transition-opacity duration-300`.
   - `opacity-50` when open; `pointer-events-none opacity-0` when closed.
2. **Dialog Surface**:
   - Container: `rounded-lg bg-white shadow-xl`.
   - Padding: `p-4 pr-12`.
   - Close button: Top-right `Button variant="transparent"` with `IconCloseSVG (h-6 w-6 text-gray-600)` at `top-3 right-3` or `top-4 right-4`.
   - Keyboard interaction: Close unconditionally on `Escape` key using `useKeyPress`.

---

## 7. Tailwind Class Ordering Convention

To maintain a clean and searchable codebase, utility classes must follow this sequence:

1. **Layout & Display**: `flex`, `grid`, `block`, `relative`, `absolute`, `fixed`, `z-[998]`
2. **Box Model & Spacing**: `p-4`, `px-3`, `py-1.5`, `m-auto`, `space-y-2`, `gap-3`
3. **Sizing**: `w-full`, `max-w-md`, `h-10`, `min-h-0`
4. **Typography**: `text-sm`, `font-semibold`, `tracking-normal`, `text-center`
5. **Colors & Backgrounds**: `bg-white`, `text-gray-800`, `border-gray-200`
6. **Borders & Shapes**: `rounded-lg`, `border-[2px]`, `shadow-md`
7. **Interactivity & States**: `hover:bg-gray-100`, `focus:ring-2`, `transition-colors`, `cursor-pointer`
8. **Responsive Breakpoints**: `sm:flex-row`, `md:w-1/2`, `lg:hidden`

---

## 8. Accessibility (a11y) Standards

1. **Color Contrast**:
   - Normal text against background must exceed WCAG AA ratio of 4.5:1.
   - Large or bold text (18px+ or 14px bold) must exceed 3:1.
   - Never place dark text (e.g. `text-black`) on middle grays (e.g. `bg-gray-500`). Use `bg-gray-800 text-white`.
2. **Focus Visibility**:
   - All interactive elements must declare explicit focus rings (`focus:outline-none focus:ring-2 focus:ring-offset-1` or `focus:ring-offset-2`).
3. **Keyboard Usability**:
   - Every modal and drawer must close on `Escape`.
   - All custom button/card elements must use native `<button type="button">` or handle `Enter`/`Space`.
4. **ARIA Attributes**:
   - Menus / accordions: `aria-expanded={isOpen}`, `aria-haspopup="listbox"`.
   - Toggle buttons: `aria-pressed={active}`.
   - List options: `role="option"`, `aria-selected={isSelected}`.

---

## 9. Development & Review Checklist

Before finalizing any UI component or style modification:
- [ ] Uses design tokens for colors (`gray-900`, `gray-800`, `gray-700`, `gray-600`, `blue-600`, `green-600`).
- [ ] Applies correct radius (`rounded-md` for inputs/buttons, `rounded-lg` for cards/modals, `rounded-full` for pills).
- [ ] Floating map controls adhere to `border-[2px] border-gray-800/50` stroke and `z-[998]` layer.
- [ ] Focus states include `focus:ring-2` with appropriate focus ring color.
- [ ] Text contrast meets WCAG AA standards.
- [ ] Tailwind utility classes follow the canonical ordering.
- [ ] Passes `npm run check` with zero Biome lint/format or TypeScript errors.
