# System Architecture & Repository Reference

This document serves as the authoritative architectural reference for AI agents and developers working on `generic-map-with-pois`.

---

## 1. High-Level Overview

`generic-map-with-pois` is an interactive Single-Page Application (SPA) built with React 18, TypeScript, Vite, Leaflet, and Tailwind CSS. It visualizes Points of Interest (POIs) on an OpenStreetMap tile layer, with automatic bounds fitting, marker clustering, fuzzy search, viewport-aware record listing, and detailed POI inspection with optional PDF export.

### Core Stack
- **Framework & Runtime**: React 18 (Strict Mode), TypeScript 5, Vite 6
- **Map & Geospatial**: Leaflet 1.9, `react-leaflet` 4.2, `react-leaflet-cluster` 2.1
- **Validation & Type Invariants**: Zod 3 (runtime schemas infer compile-time types)
- **Styling**: Tailwind CSS 3, PostCSS, Autoprefixer
- **Tooling & Quality**: Biome 2.3 (linter & formatter), Husky 9 + lint-staged (git hooks)
- **Exports & Assets**: `html2pdf.js`, `vite-plugin-svgr` (SVG as React components)

---

## 2. Directory & Module Map

```
generic-map-with-pois/
├── .agents/                    # AI agents configuration, skills, and architecture
│   ├── architecture.md         # This document (system-wide single source of truth)
│   └── skills/                 # Technology-specific progressive-disclosure skills
├── .devcontainer/              # VS Code Remote Container configuration
├── .github/                    # GitHub configuration & actions
│   └── copilot-instructions.md # GitHub Copilot tailored instructions
├── .husky/                     # Git pre-commit and pre-push hooks
├── public/                     # Static assets served as-is at root
├── src/                        # Application source code
│   ├── assets/                 # Icons (SVGs) and local JSON mock datasets
│   ├── components/             # Atomic Design component hierarchy
│   │   ├── atoms/              # Base primitives (Button, Modal, MiniMap, SearchField, etc.)
│   │   ├── molecules/          # Composite controls (ButtonGroup, MarkerElement, RecordDetails, Drawer, etc.)
│   │   ├── organisms/          # Complex feature blocks (MapContainer, MapControls, ListView, SearchSection)
│   │   └── templates/          # Layout assembly (Viewport.tsx)
│   ├── hooks/                  # Reusable hooks (useMap, useFetchData, useURLParams, useKeyPress)
│   ├── utils/                  # Pure utility helpers (fuzzyMatch, brandTypes, processApiResponse, etc.)
│   ├── constants.ts            # Map config, allowed URL patterns, marker colors, defaults
│   ├── schemas.ts              # Zod runtime data validation schemas
│   ├── types.ts                # TypeScript types inferred from Zod schemas
│   ├── main.tsx                # Application bootstrap & DOM root mount
│   └── index.css               # Tailwind directives & global map styling overrides
├── biome.json                  # Biome linting and formatting configuration
├── package.json                # Project dependencies and script runner
├── tsconfig.json               # TypeScript strict compiler configuration
└── vite.config.ts              # Vite bundle configuration & manual chunking strategy
```

---

## 3. Data Contracts & State Flow

### 3.1 Data Schemas (`src/schemas.ts` & `src/types.ts`)
All external data (API or local JSON) is validated at runtime using Zod before entering application state:

```typescript
// Custom Record Schema
customRecordSchema = z.object({
  id: z.string().brand('recordId').optional(),
  latitude: z.number(),
  longitude: z.number(),
  title: z.string(),
  description: z.union([z.string(), z.string().array()]).optional(),
  images: z.string().array().optional(),
  color: z.string().optional(),
})

// Optional Envelope Config Schema
configSchema = z.object({
  typeOfIcon: z.enum(['default', 'dot', 'text']),
  isListEnabled: z.boolean().optional(),
  isZoomOnSelectEnabled: z.boolean().optional(),
  isListFilteredToViewport: z.boolean().optional(),
  isShowOnlyURLRecordEnabled: z.boolean().optional(),
  isAggressiveOptimizationEnabled: z.boolean().optional(),
})

// Top-level payload accepted: array of records OR enveloped object
anySuccessfulResponseSchema = z.union([
  customRecordSchema.array(),
  customRecordWithMetadataSchema,
])
```

- When `id` is omitted in source data, `src/utils/processApiResponse.ts` generates deterministic fallback identifiers: `id_0`, `id_1`, etc.

### 3.2 URL Parameters & Routing
- `?api=<url>`: Target data source (validated against `ALLOWED_API_URL_PATTERNS`).
- `?id=<recordId>`: Selects and highlights a specific POI on initial load and opens its `RecordDetails` drawer.
- Sync mechanism: Managed via [`useURLParams`](file:///Users/cristi/Code/generic-map-with-pois/src/hooks/useURLParams.ts), updating query strings without page reloads.

### 3.3 Security & Safe Fetching
- URLs passed to `?api=` are strictly tested against `ALLOWED_API_URL_PATTERNS` in [`constants.ts`](file:///Users/cristi/Code/generic-map-with-pois/src/constants.ts). Only approved domains (e.g. GitHub Pages) and localhost/127.0.0.1 for local development are accepted.
- No `dangerouslySetInnerHTML`. User strings and descriptions are safely sanitized and converted to active links via [`linkifyText.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/utils/linkifyText.tsx).

---

## 4. Architectural Invariants & Rules

1. **Atomic Design Hierarchy**:
   - `Atoms` must not import from `Molecules`, `Organisms`, or `Templates`.
   - `Molecules` must not import from `Organisms` or `Templates`.
   - `Organisms` coordinate business logic, hooks, and molecules/atoms.
   - `Templates` handle page layout and assemble organisms.
2. **Strict Type Safety**:
   - Do not use TypeScript `any`. Derive all domain models using `z.infer<typeof schema>`.
   - Use branded types (e.g. `RecordId`) where identity integrity matters.
3. **Map State Coordination**:
   - Map instance state is held and coordinated by [`useMap`](file:///Users/cristi/Code/generic-map-with-pois/src/hooks/useMap.ts).
   - Bounds fitting uses `MAP_CONFIG.BOUNDS_PADDING` (0.6) to guarantee controls and drawer overlays do not obscure markers.
4. **Formatting & Linting**:
   - Biome is the sole linter and formatter. Always run `npm run check` to verify changes.
5. **Autocommit Restriction**:
   - AI assistants must never execute `git commit` automatically; leave git commits to the developer.

---

## 5. Development & Verification Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start local Vite development server with HMR |
| `npm run build` | Compile TypeScript (`tsc`) and bundle for production with Vite |
| `npm run check` | Run full validation: Biome check/format verification + `tsc --noEmit` |
| `npm run check:biome` | Run Biome lint & format check with automatic autofix |
| `npm run check:tsc` | Run TypeScript strict compiler typecheck without emitting output |
| `npm run format` | Format repository files using Biome |
| `npm run lint` | Run Biome linter across project files |
| `npm run svgo` | Optimize SVG assets in `src/assets` |
| `npm run preview` | Locally preview the built production bundle |
