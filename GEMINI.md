# Gemini CLI Project Instructions

Project: **generic-map-with-pois** (React 18 + TypeScript 5 + Vite + Leaflet + Tailwind CSS + Zod + Biome)

## Development Workflow
- Development: `npm run dev`
- Verification: `npm run check` (Biome check + `tsc --noEmit`)
- Build: `npm run build`
- Format/Lint fix: `npm run check:biome`

## Core Invariants
- **No Autocommit**: Never execute git commits after completing tasks.
- **Linter & Formatter**: Biome only (indent: 2 spaces, quotes: single, jsx: double, semicolons: asNeeded). Never introduce ESLint or Prettier.
- **Component Architecture**: Atomic design under `src/components/` (`atoms` -> `molecules` -> `organisms` -> `templates`). Strict unidirectional dependency.
- **Data Models**: Defined via Zod in `src/schemas.ts`; inferred in `src/types.ts`. Do not write duplicate manual interfaces.
- **URL Security**: Check API endpoints against `ALLOWED_API_URL_PATTERNS` in `src/constants.ts`.

## Skills & Architecture Index (Progressive Disclosure)
Consult detailed skill guides only when addressing relevant tasks:
- **Architecture & Module Guide**: [.agents/architecture.md](.agents/architecture.md)
- **Map & Geospatial Features**: [.agents/skills/leaflet-maps.md](.agents/skills/leaflet-maps.md)
- **React Components & Tailwind UI**: [.agents/skills/react-components.md](.agents/skills/react-components.md)
- **Zod Validation & Security**: [.agents/skills/zod-validation.md](.agents/skills/zod-validation.md)
- **Biome Quality & Build Pipeline**: [.agents/skills/tooling-biome.md](.agents/skills/tooling-biome.md)
