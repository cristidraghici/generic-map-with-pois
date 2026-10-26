# Skill: Zod Runtime Validation & Security Contracts

## When to Use This Skill
Use this skill when modifying POI data models, updating API ingestion schemas, adding new map configuration flags, validating external URLs, or handling runtime data contracts.

---

## 1. Schema-First Architecture

In this codebase, **runtime schemas in [`src/schemas.ts`](file:///Users/cristi/Code/generic-map-with-pois/src/schemas.ts) are the single source of truth** for all domain types. TypeScript types in [`src/types.ts`](file:///Users/cristi/Code/generic-map-with-pois/src/types.ts) are derived strictly via `z.infer`:

```typescript
// NEVER manually define parallel TypeScript interfaces.
// ALWAYS define the Zod schema first and infer the type:

export type RecordId = z.infer<typeof recordIdSchema>
export type CustomRecord = z.infer<typeof customRecordSchema>
export type Config = z.infer<typeof configSchema>
export type CustomRecordWithMetadata = z.infer<typeof customRecordWithMetadataSchema>
export type Layer = z.infer<typeof layerSchema>
export type LayerResponse = z.infer<typeof layerResponseSchema>
export type MultiLayerResponse = z.infer<typeof multiLayerResponseSchema>
export type AnySuccessfulResponse = z.infer<typeof anySuccessfulResponseSchema>
```

---

## 2. Core Schemas Reference

### 2.1 POI Record (`customRecordSchema`)
```typescript
export const recordIdSchema = z.string().brand('recordId')

export const customRecordSchema = z.object({
  id: recordIdSchema.optional(),
  latitude: z.number(),
  longitude: z.number(),
  title: z.string(),
  description: z.union([z.string(), z.string().array()]).optional(),
  images: z.string().array().optional(),
  color: z.string().optional(),
  layerId: z.string().optional(),
})
```

### 2.2 Envelope & Application Config (`configSchema`)
```typescript
export const configSchema = z.object({
  typeOfIcon: z.enum(['default', 'dot', 'text']),
  isListEnabled: z.boolean().optional(),
  isZoomOnSelectEnabled: z.boolean().optional(),
  isListFilteredToViewport: z.boolean().optional(),
  isShowOnlyURLRecordEnabled: z.boolean().optional(),
  isAggressiveOptimizationEnabled: z.boolean().optional(),
})
```

### 2.3 Layers & Response Payloads (`anySuccessfulResponseSchema`)
Supports multi-layer arrays, enveloped single datasets, and flat POI arrays:
```typescript
export const layerSchema = z.object({
  id: z.string(),
  title: z.string(),
  metadata: metadataSchema.optional(),
  records: customRecordSchema.array(),
  config: configSchema.optional(),
})

export const layerResponseSchema = z.union([
  customRecordWithMetadataSchema,
  customRecordSchema.array(),
])

export const multiLayerResponseSchema = z.array(layerResponseSchema)

export const anySuccessfulResponseSchema = z.union([
  multiLayerResponseSchema,
  customRecordWithMetadataSchema,
  customRecordSchema.array(),
])
```

---

## 3. Data Ingestion & Sanitization Pipeline

When fetching data from an external API or static JSON:

1. **URL Allowlist Check**:
   Validate API endpoints against [`ALLOWED_API_URL_PATTERNS`](file:///Users/cristi/Code/generic-map-with-pois/src/constants.ts):
   ```typescript
   export const ALLOWED_API_URL_PATTERNS: RegExp[] = [
     /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
     /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?([/\w .-]*)*\/?$/,
   ]
   ```
2. **Schema Parsing**:
   Use `anySuccessfulResponseSchema.safeParse(json)`. If validation fails, capture errors without crashing the application.
3. **ID Harmonization**:
   In [`processApiResponse.ts`](file:///Users/cristi/Code/generic-map-with-pois/src/utils/processApiResponse.ts), records lacking an `id` field are assigned branded indices (`id_0`, `id_1`, etc.) so markers and keys stay stable.

---

## 4. Security Invariants

- **XSS Prevention**: Never inject raw HTML via `dangerouslySetInnerHTML`. Description strings and URLs are rendered safely through [`linkifyText.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/utils/linkifyText.tsx).
- **Branded Types**: The `RecordId` brand prevents accidental substitution of arbitrary strings where validated record IDs are expected.
- **Strict Data Boundaries**: Do not trust incoming network data without passing through Zod parsing.

---

## 5. Common Pitfalls

- **Handling `description`**: Remember `description` can be `string | string[] | undefined`. Code that reads descriptions must handle arrays (e.g. `Array.isArray(desc) ? desc.join(' ') : desc`).
- **Partial Updates**: When updating schema definitions, ensure both flat array and enveloped responses remain valid.

---

## 6. Verification

- Run `npm run check:tsc` to verify type inference.
- Test loading valid datasets (`/cities_in_romania.json`) and invalid responses to verify graceful error fallback.
