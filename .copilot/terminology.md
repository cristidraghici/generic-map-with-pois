# Project Terminology and Type Definitions

## Map Components and Concepts

### Core Map Elements

- **POI (Point of Interest)**: A location marked on the map with specific coordinates and metadata
- **Marker**: Visual representation of a POI on the map using Leaflet markers
- **Cluster**: Group of markers that are close together, managed by react-leaflet-cluster
- **Bounds**: Geographical boundaries of the visible map area
- **Tile Layer**: Base map layer from OpenStreetMap

### Component Architecture

- **Atoms**: Basic UI components
  - Button
  - Input
  - Modal
  - Tooltip
  - ConditionalElement
- **Molecules**: Simple combinations of atoms
  - SearchField
  - ButtonGroup
  - MarkerElement
  - POIDetails
- **Organisms**: Complex components
  - MapControls
  - SearchSection
- **Templates**: Page-level components
  - Map (main application template)

## Data Types and Interfaces

### POI Data Structures

```typescript
// Basic POI data
interface CustomMarker {
  latitude: number
  longitude: number
  title: string
  description?: string | string[]
}

// POI data with metadata
interface CustomMarkerWithMetadata {
  metadata: string | string[]
  records: CustomMarker[]
}
```

### Component Props

```typescript
// Common prop patterns
interface SearchProps {
  value: string
  onChange: (_value: string) => void
  onCancel: () => void
}

interface MapControlProps {
  map: MapType | null
  isZoomInDisabled: boolean
  isZoomOutDisabled: boolean
}
```

## Configuration Constants

### Map Settings

```typescript
// Map tile layer configuration
const MAP_TILE_LAYER = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}

// Default map configuration
const MAP_CONFIG = {
  CENTER: [44.4268, 26.1025],
  ZOOM: 3,
  BOUNDS_PADDING: 0.2,
}
```

### Security Patterns

```typescript
// URL validation patterns
const ALLOWED_API_URL_PATTERNS: RegExp[] = [
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
]
```

## Custom Hooks

### Map Management

- **useMap**: Manages map instance and bounds
- **useGetPOIs**: Handles POI data fetching and filtering
- **useURLParams**: Manages URL parameter state

## Development Tools

- **TypeScript**: Static typing and type checking
- **Zod**: Runtime schema validation
- **React**: UI component library
- **Leaflet**: Map rendering library
- **TailwindCSS**: Utility-first CSS framework
