# Claude Code Project Guidelines

Interactive POI map web app using React 18, TypeScript, Vite, Leaflet, Tailwind CSS, and Zod.

## Primary Verification Commands
- `npm run check` - Run Biome linter/formatter check and TypeScript typecheck (primary check)
- `npm run dev` - Start local dev server
- `npm run build` - Full TypeScript check & production bundle build
- `npm run check:biome` - Biome check with autofix
- `npm run check:tsc` - Strict typecheck only

## Critical Rules & Invariants
1. **Never autocommit**: Do NOT run `git commit` automatically; leave all commits to the developer.
2. **Biome tooling**: Do NOT add ESLint or Prettier. Formatting (2 spaces, single quote, no semicolons) and linting are strictly handled by Biome (`biome.json`).
3. **Atomic Design**: Structure components strictly in `src/components/{atoms,molecules,organisms,templates}`. Lower layers never import from higher layers.
4. **Zod as single source of truth**: Domain types in `src/types.ts` must be inferred from schemas in `src/schemas.ts` using `z.infer`. Never create loose, unvalidated interfaces for POI data.
5. **Safe Data & Security**: URLs must pass `ALLOWED_API_URL_PATTERNS`. Do not use `dangerouslySetInnerHTML`.

## Progressive Disclosure & Reference Skills
Load detailed documentation only when relevant to your task:
- **System Architecture & Data Flow**: Read [.agents/architecture.md](.agents/architecture.md)
- **Leaflet & Geospatial Logic**: Read [.agents/skills/leaflet-maps.md](.agents/skills/leaflet-maps.md)
- **Component Architecture & Tailwind**: Read [.agents/skills/react-components.md](.agents/skills/react-components.md)
- **Runtime Schemas & Security**: Read [.agents/skills/zod-validation.md](.agents/skills/zod-validation.md)
- **Biome & Tooling Pipeline**: Read [.agents/skills/tooling-biome.md](.agents/skills/tooling-biome.md)
