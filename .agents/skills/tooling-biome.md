# Skill: Biome Toolchain, TypeScript & Code Quality

## When to Use This Skill
Use this skill when running validations, formatting code, fixing lint errors, configuring build scripts, optimizing assets, or understanding the project's verification pipeline.

---

## 1. Toolchain Overview

This repository uses **Biome 2.3** as its unified linter and code formatter. ESLint and Prettier are not used.

- **Formatter & Linter**: `@biomejs/biome` (configured in [`biome.json`](file:///Users/cristi/Code/generic-map-with-pois/biome.json))
- **Type Checker**: `typescript` with [`tsconfig.json`](file:///Users/cristi/Code/generic-map-with-pois/tsconfig.json)
- **Git Hooks**: Husky 9 + `lint-staged` (`.lintstagedrc.json`) runs Biome check on staged files prior to commit
- **Asset Optimizer**: SVGO (`npm run svgo`) for SVG cleanup

---

## 2. Formatting & Style Rules

Configured in [`biome.json`](file:///Users/cristi/Code/generic-map-with-pois/biome.json):
- **Indentation**: 2 spaces
- **Line Width**: 80 characters
- **Quotes**: Single quotes for JavaScript/TypeScript, double quotes for JSX (`"`)
- **Semicolons**: `asNeeded` (omit trailing semicolons unless necessary for syntax disambiguation)
- **Trailing Commas**: `all`
- **Arrow Parentheses**: Always (`(arg) => ...`)
- **Unused Variables**: Treated as error (`correctness.noUnusedVariables: 'error'`)
- **Ignored Files**: `src/assets/world_cities.json` (large dataset excluded from linting)

---

## 3. Essential Commands Reference

```bash
# Full verification (Run before completing any task)
npm run check

# Biome verification and autofix
npm run check:biome

# Strict TypeScript type checking
npm run check:tsc

# Lint-only check
npm run lint

# Format code across repository
npm run format

# Production build verification
npm run build

# Optimize SVG files in src/assets
npm run svgo
```

---

## 4. Git Hooks & Lint-Staged

- `.husky/pre-commit`: Runs `npx lint-staged` on staged files.
- `.lintstagedrc.json`:
  ```json
  {
    "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
      "biome check --write --no-errors-on-unmatched"
    ]
  }
  ```
- **Important**: Assistants must NOT commit to git automatically. Leave staging and committing to the developer.

---

## 5. Build Optimization & Chunking

[`vite.config.ts`](file:///Users/cristi/Code/generic-map-with-pois/vite.config.ts) defines manual chunk splitting to keep initial bundle size minimal and avoid chunk warnings:
- `vendor-react`: `react`, `react-dom`
- `vendor-leaflet`: `leaflet`, `react-leaflet`, `react-leaflet-cluster`
- `vendor-html2pdf`: `html2pdf.js`

Do not restructure imports in a way that breaks this manual chunk allocation.

---

## 6. Pre-Completion Quality Checklist for AI Agents

1. Run `npm run check:biome` to apply necessary formatting and resolve any lint issues.
2. Run `npm run check:tsc` to verify no type regressions.
3. If changes impact bundle or imports, run `npm run build` to confirm production bundling succeeds without errors.
