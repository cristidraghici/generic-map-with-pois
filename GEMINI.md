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
- **URL Security**: Check API endpoints via `src/utils/validateApiUrl.ts` (same-origin auto-allow, `ALLOWED_API_URL_PATTERNS` in `src/constants.ts`, and optional untracked `public/config.json`).
- **Self-Updating Documentation**: Agents must self-update project documentation and skills (`.agents/architecture.md`, `.agents/skills/*.md`, `README.md`, `AGENTS.md`, `GEMINI.md`, and `.github/copilot-instructions.md`) whenever adding or modifying features that affect architecture, data contracts, UI components, URL parameters, or developer workflows.

## Skills & Architecture Index (Progressive Disclosure)
Consult detailed skill guides only when addressing relevant tasks:
- **Architecture & Module Guide**: [.agents/architecture.md](.agents/architecture.md)
- **Design System & UI Style Guide**: [.agents/skills/design-system.md](.agents/skills/design-system.md)
- **Map & Geospatial Features**: [.agents/skills/leaflet-maps.md](.agents/skills/leaflet-maps.md)
- **React Components & Tailwind UI**: [.agents/skills/react-components.md](.agents/skills/react-components.md)
- **Zod Validation & Security**: [.agents/skills/zod-validation.md](.agents/skills/zod-validation.md)
- **Biome Quality & Build Pipeline**: [.agents/skills/tooling-biome.md](.agents/skills/tooling-biome.md)
