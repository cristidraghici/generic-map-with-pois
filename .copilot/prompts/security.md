# Security Guidelines

## URL Validation

```typescript
const ALLOWED_API_URL_PATTERNS: RegExp[] = [
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, // Matches Github pages URLs
]

function isURLAllowed(urlToTest: string): boolean {
  return ALLOWED_API_URL_PATTERNS.some((pattern) => pattern.test(urlToTest))
}
```

## Data Validation

Use Zod schemas for runtime data validation:

```typescript
const customMarkerSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  title: z.string(),
  description: z.union([z.string(), z.string().array()]).optional(),
})

const metadataSchema = z.union([z.string(), z.string().array()])

const customMarkerWithMetadataSchema = z.object({
  metadata: metadataSchema,
  records: customMarkerSchema.array(),
})
```

## API Security Practices

1. Validate all incoming API URLs
2. Parse and validate response data using Zod
3. Handle API errors gracefully
4. Implement request timeouts
5. Use type-safe request handling

## XSS Prevention

1. Sanitize POI descriptions and titles
2. Use React's built-in XSS prevention
3. Avoid dangerouslySetInnerHTML
4. Validate map tile sources

## Error Handling

```typescript
try {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  const validatedData = customMarkerSchema.parse(data)
} catch (error) {
  // Handle errors appropriately
}
```

## URL Parameter Handling

1. Sanitize URL parameters
2. Validate API endpoints
3. Handle malformed parameters
4. Implement safe defaults

## Best Practices

1. Use strict TypeScript checks
2. Implement proper error boundaries
3. Validate external data
4. Follow React security guidelines
5. Keep dependencies updated
