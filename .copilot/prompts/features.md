# Feature Implementation Guidelines

## Core Features

### 1. POI Management

```typescript
// POI Data Structure
interface CustomMarker {
  latitude: number;
  longitude: number;
  title: string;
  description?: string | string[];
}

// POI Loading
const { records, metadata, error, loading } = useGetPOIs(apiUrl, searchQuery);

// POI Display
<MarkerElement
  key={index}
  marker={poi}
  onClick={() => handlePOISelect(poi)}
>
  <POIDetails {...poi} />
</MarkerElement>
```

### 2. Map Controls

```typescript
// Map Hook Usage
const {
  map,
  setMap,
  setMapBounds,
  isZoomInDisabled,
  isZoomOutDisabled,
  config,
} = useMap(records)

// Map Configuration
const MAP_CONFIG = {
  CENTER: [44.4268, 26.1025],
  ZOOM: 3,
  BOUNDS_PADDING: 0.2,
}
```

### 3. Search Implementation

```typescript
// Search Logic
const getFilteredRecords = (records: CustomMarker[], searchTerm?: string) => {
  if (!searchTerm) return records;

  return records.filter((record) => {
    const searchableText = `${record.title} ${
      Array.isArray(record.description)
        ? record.description.join(' ')
        : record.description || ''
    }`.toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });
};

// Search Component Usage
<SearchSection
  search={search}
  loading={loading}
  error={error}
  onSearchChange={handleSearchChange}
  onSearchCancel={handleSearchCancel}
/>
```

### 4. URL Parameter Handling

```typescript
// URL Hook
function useURLParams(): URLParams {
  const [params, setParams] = useState<URLParams>({})

  useEffect(() => {
    // URL parameter management logic
  }, [])

  return params
}
```

## Feature Implementation Patterns

### 1. Data Loading

- Use custom hooks for data fetching
- Implement proper error handling
- Show loading states
- Handle API responses

### 2. State Management

- Use React hooks effectively
- Implement proper state updates
- Handle side effects
- Manage component lifecycle

### 3. User Interaction

- Implement responsive controls
- Handle user input
- Provide visual feedback
- Support keyboard navigation

### 4. Error Handling

- Show user-friendly error messages
- Implement fallback UI
- Handle API errors
- Validate user input

## Best Practices

### 1. Performance

- Use marker clustering
- Implement lazy loading
- Optimize re-renders
- Cache API responses

### 2. Security

- Validate API URLs
- Sanitize user input
- Handle data safely
- Implement proper CSP

### 3. Accessibility

- Support keyboard navigation
- Provide ARIA labels
- Use semantic HTML
- Test with screen readers

### 4. Testing

- Write unit tests
- Implement integration tests
- Test error scenarios
- Validate user flows
