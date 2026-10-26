# Agents Configuration & Project Guide

Authoritative instructions for autonomous coding agents working on `generic-map-with-pois`.

## System Overview
Interactive POI mapping web application built with React 18, TypeScript, Vite, Leaflet, Tailwind CSS, and Zod.

## Build and Verification Commands
- `npm run check`: Complete verification command (runs Biome check/format check and `tsc --noEmit`). Must pass with zero errors.
- `npm run dev`: Launch local Vite dev server.
- `npm run build`: Production bundle compilation with manual chunking.
- `npm run check:biome`: Fast Biome lint and format autofix.
- `npm run check:tsc`: Strict TypeScript typecheck.

## Mandatory Coding Constraints
1. **Never Autocommit**: Do not stage or commit git changes automatically.
2. **Biome Exclusivity**: Biome is the sole linter and formatter. Do not run or install Prettier/ESLint.
3. **Atomic Design Discipline**: Follow `src/components/{atoms,molecules,organisms,templates}`. Downward dependencies only (Atoms never import higher tiers).
4. **Schema-Driven Typing**: All POI types derive from Zod schemas in `src/schemas.ts` (`z.infer`). No parallel or untyped data contracts.
5. **Geospatial Best Practices**: Keep Leaflet coordinates (`[lat, lng]`) separate from record models (`{ latitude, longitude }`). Use `MAP_CONFIG.BOUNDS_PADDING` (0.6) on viewport adjustments.
6. **Safe URL & Data Ingestion**: All user-provided API URLs must match `ALLOWED_API_URL_PATTERNS`.
7. **Documentation & Skill Self-Update**: Whenever building, modifying, or extending features, agents must self-update relevant documentation and skills if the changes affect architecture, schemas, components, URL parameters, configurations, or workflow conventions. Specifically update `.agents/architecture.md`, relevant guides in `.agents/skills/*.md`, `README.md`, `AGENTS.md`, `GEMINI.md`, and `.github/copilot-instructions.md`. Never leave agent instructions or skill guides out of sync with code changes.

## Reference Documentation & Skills (Progressive Disclosure)
Refer to the following specialized guides as needed for detailed implementation:
- **System Architecture & Data Contracts**: [.agents/architecture.md](.agents/architecture.md)
- **Design System & UI Style Guide**: [.agents/skills/design-system.md](.agents/skills/design-system.md)
- **Map & Geospatial Implementation**: [.agents/skills/leaflet-maps.md](.agents/skills/leaflet-maps.md)
- **React Components & Tailwind Styling**: [.agents/skills/react-components.md](.agents/skills/react-components.md)
- **Zod Validation & Security**: [.agents/skills/zod-validation.md](.agents/skills/zod-validation.md)
- **Biome Toolchain & TypeScript**: [.agents/skills/tooling-biome.md](.agents/skills/tooling-biome.md)
