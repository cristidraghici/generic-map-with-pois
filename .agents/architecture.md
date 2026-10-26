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
│   │   ├── atoms/              # Base primitives (Button, Modal, PillButton, SearchField, Select, etc.)
│   │   ├── molecules/          # Composite controls (ButtonGroup, FilterAccordion, NumericRangeFilter, MarkerElement, MiniMap, RecordDetails, Drawer, etc.)
│   │   ├── organisms/          # Complex feature blocks (MapContainer, MapControls, ListView, SearchSection)
│   │   └── templates/          # Layout assembly (Viewport.tsx)
│   ├── hooks/                  # Reusable hooks (useMap, useFetchData, useURLParams, useKeyPress)
│   ├── utils/                  # Pure utility helpers (filterRecords, fuzzyMatch, brandTypes, processApiResponse, etc.)
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
// Filter Definition Schemas
filterOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
})
filterTypeSchema = z.enum(['checkbox', 'select', 'range'])
filterDefinitionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: filterTypeSchema,
  field: z.string().optional(),
  options: filterOptionSchema.array().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  unit: z.string().optional(),
})

// Custom Record Schema
customRecordSchema = z.object({
  id: z.string().brand('recordId').optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  title: z.string(),
  description: z.union([z.string(), z.string().array()]).optional(),
  images: z.string().array().optional(),
  color: z.string().optional(),
  layerId: z.string().optional(),
  tags: z.string().array().optional(),
  properties: z.record(z.unknown()).optional(),
}).passthrough()

// Optional Envelope Config Schema
configSchema = z.object({
  typeOfIcon: z.enum(['default', 'dot', 'text']),
  isListEnabled: z.boolean().optional(),
  isZoomOnSelectEnabled: z.boolean().optional(),
  isListFilteredToViewport: z.boolean().optional(),
  isShowOnlyURLRecordEnabled: z.boolean().optional(),
  isAggressiveOptimizationEnabled: z.boolean().optional(),
})

// Normalized Layer Schema
layerSchema = z.object({
  id: z.string(),
  title: z.string(),
  metadata: metadataSchema.optional(),
  records: customRecordSchema.array(),
  config: configSchema.optional(),
  filters: filterDefinitionSchema.array().optional(),
})

// Custom Record with Metadata Envelope
customRecordWithMetadataSchema = z.object({
  title: z.string().optional(),
  metadata: metadataSchema.optional(),
  records: customRecordSchema.array(),
  config: configSchema.optional(),
  filters: filterDefinitionSchema.array().optional(),
})

// Multi-layer response schema
layerResponseSchema = z.union([
  customRecordWithMetadataSchema,
  customRecordSchema.array(),
])
multiLayerResponseSchema = z.array(layerResponseSchema)

// Top-level payload accepted: multi-layer array, enveloped object, OR flat array of records
anySuccessfulResponseSchema = z.union([
  multiLayerResponseSchema,
  customRecordWithMetadataSchema,
  customRecordSchema.array(),
])

// Optional Runtime Config Schema (public/config.json)
runtimeConfigSchema = z.object({
  allowedApiOrigins: z.string().array().optional(),
  allowedApiPatterns: z.string().array().optional(),
})
```

- When `id` is omitted in source data, `src/utils/processApiResponse.ts` and `src/hooks/useFetchData.ts` generate deterministic fallback identifiers (`id_0`, `id_1`, etc.), ensuring ID uniqueness across multiple layers.
- For multi-layer responses, `src/utils/processApiResponse.ts` normalizes layers, associates each record with its `layerId`, inherits the global map config from the first layer (falling back to `DEFAULT_CONFIG`), and `src/components/organisms/MapControls.tsx` renders a layer selection modal. Visible layers are managed in React state, synchronizing the map, search, and list view without re-fitting bounds.

### 3.2 URL Parameters & Routing
- `?api=<url>`: Target data source (validated against `ALLOWED_API_URL_PATTERNS`). Built-in mock datasets in `src/assets/` are lazy-loaded on demand via dynamic `import()` chunks and validated through `anySuccessfulResponseSchema`.
- `?api[]=<url>` (repeatable, may be mixed with `?api=`): Multiple data sources. All are fetched in parallel by [`useFetchData`](file:///Users/cristi/Code/generic-map-with-pois/src/hooks/useFetchData.ts) and kept in memory with pre-indexed search tokens; when 2+ are provided, a dataset dropdown is shown below the search input. Option labels resolve as: envelope `title` → first `metadata` entry → raw URL.
- `?selected=<index>`: Zero-based index of the active dataset (defaults to `0`). Switching datasets clears the search, closes the drawer, and removes `?id=`.
- `?id=<recordId>`: Selects and highlights a specific POI on initial load and opens its `RecordDetails` drawer.
- Sync mechanism: Managed via [`useURLParams`](file:///Users/cristi/Code/generic-map-with-pois/src/hooks/useURLParams.ts) (`params`, `listParams`, `updateParams`), updating query strings via `history.replaceState` without page reloads.

### 3.3 Security & Safe Fetching
- URLs passed to `?api=` are validated by [`validateApiUrl.ts`](file:///Users/cristi/Code/generic-map-with-pois/src/utils/validateApiUrl.ts):
  1. Relative and same-origin URLs (e.g. `?api=all.json`, `?api=/data/pois.json`) resolved against `window.location.href` are automatically allowed on the deployment origin (`Origin.from().isSameOrigin()` with `URL.origin` fallback).
  2. External URLs are checked against `ALLOWED_API_URL_PATTERNS` in [`constants.ts`](file:///Users/cristi/Code/generic-map-with-pois/src/constants.ts).
  3. Additional origins (`allowedApiOrigins`) and regex patterns (`allowedApiPatterns`) can be configured per deployment via an untracked `public/config.json` (auto-created from [`public/config.example.json`](file:///Users/cristi/Code/generic-map-with-pois/public/config.example.json) during dev/build and silently ignored at runtime if absent).
- No `dangerouslySetInnerHTML`. User strings and descriptions are safely sanitized and converted to active links via [`linkifyText.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/utils/linkifyText.tsx), and Leaflet `divIcon` HTML templates escape titles and sanitize CSS colors in [`createTextIcon.ts`](file:///Users/cristi/Code/generic-map-with-pois/src/utils/icons/createTextIcon.ts) and [`createSvgIcon.ts`](file:///Users/cristi/Code/generic-map-with-pois/src/utils/icons/createSvgIcon.ts).

### 3.4 Source-Defined Interactive Filters
- Sources can declare a `filters` array in their envelope or layers. Supported types: `checkbox` (multi-select pill toggles), `select` (single-select options), and `range` (min/max numeric inputs that convert string numbers).
- In [`SearchSection.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/components/organisms/SearchSection.tsx), if filters are defined for the active source, a dropdown-styled collapsible accordion panel ([`FilterAccordion.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/components/molecules/FilterAccordion.tsx)) renders directly below the dataset selector (or directly below the search input when only one dataset is loaded).
- Filter state is managed in local React state, updating map markers and list view live, with active badge counts and a clear-all button. Switching datasets resets active filters.

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
6. **Documentation & Agent Skill Synchronization (Self-Updating)**:
   - When introducing or altering features (such as data schemas, components, geospatial algorithms, URL parameters, configuration options, or developer commands), agents must self-update `.agents/architecture.md`, relevant `.agents/skills/*.md` guides, `README.md`, and agent instruction sets (`AGENTS.md`, `GEMINI.md`, `.github/copilot-instructions.md`). Never allow agent knowledge bases to become stale or drift from actual codebase implementation.

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
---

## 6. Reference Skills & Progressive Disclosure

Consult the specialized skill guides in `.agents/skills/` for detailed domain patterns:
- **Design System & UI Style Guide**: [`.agents/skills/design-system.md`](file:///.agents/skills/design-system.md)
- **Map & Geospatial Implementation**: [`.agents/skills/leaflet-maps.md`](file:///.agents/skills/leaflet-maps.md)
- **React Components & Atomic Architecture**: [`.agents/skills/react-components.md`](file:///.agents/skills/react-components.md)
- **Zod Validation & Data Contracts**: [`.agents/skills/zod-validation.md`](file:///.agents/skills/zod-validation.md)
- **Biome Toolchain & TypeScript**: [`.agents/skills/tooling-biome.md`](file:///.agents/skills/tooling-biome.md)
