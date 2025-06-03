# Map Implementation Guidelines

## Map Configuration

```typescript
const MAP_CONFIG = {
  CENTER: [44.4268, 26.1025], // Default center (Bucharest)
  ZOOM: 3,
  BOUNDS_PADDING: 0.2,
}
```

## Map Features

### Markers

- Use custom marker icons with shadow
- Support clustering for multiple markers
- Double-click for detailed view
- Tooltip on hover

### Map Controls

```typescript
interface MapControlsProps {
  map: MapType | null
  isZoomInDisabled: boolean
  isZoomOutDisabled: boolean
  loading: boolean
  metadata?: string
  onRefresh: () => void
  setMapBounds: () => void
}
```

### POI Data Structure

```typescript
interface CustomMarker {
  latitude: number
  longitude: number
  title: string
  description?: string | string[]
}

interface CustomMarkerWithMetadata {
  metadata: string | string[]
  records: CustomMarker[]
}
```

## Security Guidelines

1. Validate API URLs against allowed patterns
2. Sanitize POI data using Zod schemas
3. Validate map bounds and coordinates

## Performance Best Practices

1. Use marker clustering for large datasets
2. Implement bounds padding for better UX
3. Debounce map event handlers
4. Lazy load map resources

## Error Handling

1. Handle invalid coordinates
2. Manage API request failures
3. Handle invalid map states
4. Provide fallback center/zoom

## Data Loading Patterns

```typescript
// Example data fetching with error handling
const { records, metadata, error, loading } = useGetPOIs(apiUrl, searchQuery)

// Example map initialization
const { map, setMap, setMapBounds } = useMap(records)
```
