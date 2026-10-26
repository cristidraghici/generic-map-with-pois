# Skill: Leaflet Maps & Geospatial Visualization

## When to Use This Skill
Use this skill when implementing or modifying map rendering, marker behaviors, clustering, zoom/pan controls, tile layers, coordinate transformations, or bounds calculations.

---

## 1. Architecture & Libraries
- **Leaflet**: Core geospatial engine (version `^1.9.4`).
- **`react-leaflet`**: React wrapper components (`MapContainer`, `TileLayer`, `Marker`, `Tooltip`, version `^4.2.1`).
- **`react-leaflet-cluster`**: Marker clustering to handle high density POIs gracefully without DOM lag (version `^2.1.0`).
- **Tile Provider**: OpenStreetMap standard tile layer.

---

## 2. Configuration & Invariants

All global map constants live in [`src/constants.ts`](file:///Users/cristi/Code/generic-map-with-pois/src/constants.ts):

```typescript
export const MAP_CONFIG = {
  CENTER: [44.4268, 26.1025] as LatLngExpression, // Default center: Bucharest
  ZOOM: 3,
  BOUNDS_PADDING: 0.6, // Generous padding to prevent drawer/controls from occluding markers
} as const

export const MAP_TILE_LAYER = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
} as const

export const MARKER_COLORS = {
  red: '#DC2626',
  blue: '#3B82F6',
  green: '#10B981',
} as const
```

---

## 3. Implementation Patterns

### 3.1 Managing Map State via `useMap`
The [`useMap`](file:///Users/cristi/Code/generic-map-with-pois/src/hooks/useMap.ts) hook encapsulates Leaflet map instance tracking and bounds fitting:

```typescript
const {
  map,
  setMap,
  setMapBounds,
  isZoomInDisabled,
  isZoomOutDisabled,
} = useMap(records)
```

- When new records arrive or active filters change, call `setMapBounds()` to smoothly fit the viewport to marker coordinates using `bounds.pad(MAP_CONFIG.BOUNDS_PADDING)`.
- Always check if `records.length > 0` before fitting bounds. If records are empty, fall back to `MAP_CONFIG.CENTER` and `MAP_CONFIG.ZOOM`.
- When layers are toggled on/off in multi-layer datasets, bounds are intentionally preserved rather than re-fit, ensuring smooth panning/zooming without jarring viewport jumps.

### 3.2 Marker Rendering & Clustering
Render markers inside `<MarkerClusterGroup>` within [`MapContainer.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/components/organisms/MapContainer.tsx):

```tsx
<MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
  {records.map((record) => (
    <MarkerElement
      key={record.id}
      marker={record}
      color={record.color}
      typeOfIcon={config.typeOfIcon}
      onClick={() => onSelectRecord(record)}
    />
  ))}
</MarkerClusterGroup>
```

- Custom icons: Use Leaflet's `L.divIcon` or `L.icon` with SVG templates (`dot`, `default`, `text`). Ensure anchor points (`iconAnchor`, `popupAnchor`) match the visual center.
- Pass `record.color` dynamically to customize pin themes.

### 3.3 Coordinate Conventions
- Leaflet functions expect tuples: `[lat, lng]` (or `L.latLng(lat, lng)`).
- Data records provide: `{ latitude: number, longitude: number }`.
- Ensure values are validated numbers (`-90 <= latitude <= 90` and `-180 <= longitude <= 180`).

---

## 4. Common Pitfalls & Prohibitions

1. **Direct Leaflet DOM Mutations**: Never bypass React to attach DOM listeners directly without proper cleanup in `useEffect`.
2. **Missing Padding on FitBounds**: Fitting bounds without `BOUNDS_PADDING` causes edge markers to be hidden behind the top search bar, zoom buttons, or sliding drawer.
3. **Cluster Invalidation**: Ensure clustered markers have unique, stable keys (`record.id`). Do not use index keys when list ordering or filtering changes.
4. **Vite Manual Chunking**: Leaflet and its CSS assets must remain chunked cleanly as configured in [`vite.config.ts`](file:///Users/cristi/Code/generic-map-with-pois/vite.config.ts). Do not introduce side-effect imports that break chunk splitting.

---

## 5. Verification & Testing

- **Compiler check**: `npm run check:tsc` ensures Leaflet type definitions (`@types/leaflet`) are satisfied.
- **Linter check**: `npm run check:biome`.
- **Manual Verification**: Run `npm run dev` and test:
  1. Default load with `/cities_in_romania.json`.
  2. Large dataset performance with `/world_cities.json` (verifies clustering performance).
  3. Clicking a marker centers and highlights it.
  4. Resizing window adjusts bounds without distortion.
