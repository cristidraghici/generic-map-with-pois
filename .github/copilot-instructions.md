# GitHub Copilot Repository Instructions

Context and guidelines for GitHub Copilot in `generic-map-with-pois`.

## Project Overview
Interactive Points of Interest (POI) map application built with React 18, TypeScript, Vite, Leaflet, Tailwind CSS, Zod, and Biome.

## Code Style & Formatting
- **Formatting Engine**: Biome 2.3 (Do NOT recommend or format with Prettier or ESLint).
- **Indentation**: 2 spaces.
- **Quotes**: Single quotes for JS/TS, double quotes for JSX (`"value"`).
- **Semicolons**: As needed (`asNeeded` - omit trailing semicolons).
- **Tailwind Order**: Layout -> Spacing -> Sizing -> Typography -> Colors -> Borders -> Effects -> States -> Breakpoints.

## Architecture & Conventions

### 1. Atomic Design (`src/components/`)
- `atoms/`: Base primitives (Button, Modal, MiniMap, SearchField, etc.). No domain logic.
- `molecules/`: Composed atoms (ButtonGroup, MarkerElement, RecordDetails, Drawer, etc.).
- `organisms/`: Complex units managing state and hooks (MapContainer, MapControls, ListView, SearchSection).
- `templates/`: Full-page layouts (`Viewport.tsx`).
- **Rule**: Lower tiers never import higher tiers.

### 2. Runtime Validation & Types
- All POI data models originate as Zod schemas in `src/schemas.ts` (`customRecordSchema`, `configSchema`, etc.).
- Types in `src/types.ts` are strictly inferred using `z.infer<typeof schema>`. Never create disconnected TypeScript interfaces.
- Incoming API data must be validated with `anySuccessfulResponseSchema.safeParse()`.

### 3. Geospatial & Leaflet (`useMap`)
- Use `useMap(records)` hook to coordinate Leaflet map instance and viewport bounds.
- Use `bounds.pad(MAP_CONFIG.BOUNDS_PADDING)` (padding factor: 0.6) when fitting bounds.
- Marker clustering is managed via `react-leaflet-cluster` inside `MapContainer.tsx`.
- Default coordinates: `MAP_CONFIG.CENTER` ([44.4268, 26.1025] - Bucharest) and `ZOOM: 3`.

### 4. Security
- External URLs must validate against `ALLOWED_API_URL_PATTERNS` in `src/constants.ts`.
- No `dangerouslySetInnerHTML`. Safe text linkification is handled via `linkifyText.tsx`.

### 5. Self-Updating Documentation & Agent Invariants
- Whenever creating or modifying features (e.g. schemas, components, URL parameters, map behaviors, or build scripts), agents and assistants must self-update related documentation and skills in `.agents/architecture.md`, `.agents/skills/`, `README.md`, `AGENTS.md`, `GEMINI.md`, and this file.

## Key Commands
- Verification: `npm run check` (Biome check + `tsc --noEmit`)
- Formatting: `npm run check:biome`
- Build: `npm run build`

## Detailed References
For in-depth architectural and implementation guides, see:
- Architecture & Data Contracts: `.agents/architecture.md`
- Leaflet & Maps Skill: `.agents/skills/leaflet-maps.md`
- React Components & Tailwind Skill: `.agents/skills/react-components.md`
- Zod Validation Skill: `.agents/skills/zod-validation.md`
- Biome Toolchain Skill: `.agents/skills/tooling-biome.md`
