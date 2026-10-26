# Generic map with POIs

> This is a generic Leaflet map with points of interest (POIs)

## Demo

### Remote

[https://cristidraghici.github.io/generic-map-with-pois/?api=/cities_in_romania.json&api=/multi_layer_sample.json&api=/world_cities.json&api=/cultural_landmarks_paris.json&api=/national_parks.json&api=/space_launch_sites.json&selected=0](https://cristidraghici.github.io/generic-map-with-pois/?api=/cities_in_romania.json&api=/multi_layer_sample.json&api=/world_cities.json&api=/cultural_landmarks_paris.json&api=/national_parks.json&api=/space_launch_sites.json&selected=0)

### Local development

[http://localhost:5173/?api=/cities_in_romania.json&api=/multi_layer_sample.json&api=/world_cities.json&api=/cultural_landmarks_paris.json&api=/national_parks.json&api=/space_launch_sites.json&selected=0](http://localhost:5173/?api=/cities_in_romania.json&api=/multi_layer_sample.json&api=/world_cities.json&api=/cultural_landmarks_paris.json&api=/national_parks.json&api=/space_launch_sites.json&selected=0)

## About

This project uses React, TypeScript, Leaflet, and OpenStreetMap to display points of interest (POIs). It automatically fits bounds and zooms to the loaded POIs.

---

## Data Structures & Source File Formats

When you specify an address in the `?api=` URL parameter (or repeat `?api=` for multiple datasets), the application validates and parses the JSON response. The root of the JSON file supports **three flexible formats**:

1. **Multi-Layer Array** (multiple layers with toggleable visibility)
2. **Single Enveloped Dataset** (single layer with title, metadata, and config)
3. **Flat POI Array** (simple list of POIs)

---

### 1. Point of Interest (`PointOfInterest` / `CustomRecord`)

The individual record representation:

```typescript
type PointOfInterest = {
  /**
   * Unique identifier for the POI.
   * If omitted, a deterministic ID (id_0, id_1, etc.) is automatically generated.
   */
  id?: string;

  /** Latitude coordinate (-90 to 90) */
  latitude: number;

  /** Longitude coordinate (-180 to 180) */
  longitude: number;

  /** Primary title of the location */
  title: string;

  /**
   * Detailed description of the point.
   * Can be a single string or an array of paragraphs.
   * URLs inside descriptions are automatically rendered as clickable links.
   */
  description?: string | string[];

  /** Optional array of image URLs to display in the image gallery */
  images?: string[];

  /**
   * Optional custom hex or CSS color for the map pin / marker (e.g. "#DC2626").
   * Defaults to green if description is an array, blue otherwise.
   */
  color?: string;

  /** Optional internal layer identifier associating this record with a specific layer */
  layerId?: string;
};
```

---

### 2. Configuration (`Config`)

Controls map behavior, list visibility, and marker appearance:

```typescript
type Config = {
  /**
   * Marker rendering style:
   * - "default": Standard SVG pin marker with drop pin graphic
   * - "dot": Compact dot marker
   * - "text": Displays the POI title directly as the marker icon
   */
  typeOfIcon: "default" | "dot" | "text";

  /** Show the bottom drawer button to toggle the list view (default: true) */
  isListEnabled?: boolean;

  /** Zoom into the POI when clicked on the map or selected from the list (default: false) */
  isZoomOnSelectEnabled?: boolean;

  /** Filter the list view items strictly to POIs currently visible in the map viewport (default: false) */
  isListFilteredToViewport?: boolean;

  /** When ?id= is present in the URL, display only that specific record on the map (default: true) */
  isShowOnlyURLRecordEnabled?: boolean;

  /** Aggressively thin markers at lower zooms to boost performance with large datasets (default: false) */
  isAggressiveOptimizationEnabled?: boolean;
};
```

---

### 3. Metadata (`Metadata`)

Dataset context, provenance, or attribution rendered in the information modal:

```typescript
type Metadata = string | string[];
```

---

### 4. Source-Defined Filters (`FilterDefinition`)

Sources can declare a `filters` array in envelopes or layers. If specified, a collapsible accordion panel styled after the source selector appears directly below it (or below the search input when only one source is loaded):

```typescript
type FilterOption = {
  label: string;
  value: string;
};

type FilterDefinition = {
  /** Unique filter identifier */
  id: string;

  /** Display label for the filter section */
  label: string;

  /**
   * Filter control type:
   * - "checkbox": Multi-select pill toggle buttons (OR matching within filter)
   * - "select": Single-choice pill options
   * - "range": Numeric min/max inputs (automatically converts text to numbers)
   */
  type: "checkbox" | "select" | "range";

  /** Record property key or property within record.properties to evaluate (defaults to id) */
  field?: string;

  /** Selectable choices for checkbox and select filter types */
  options?: FilterOption[];

  /** Optional unit label displayed for range filters (e.g. "people", "meters", "year") */
  unit?: string;
};
```

**Features of the Filter Panel:**
- **Matching Dropdown Aesthetic**: Styled identically to the native dropdown controls with border, rounded styling, and smooth toggle animations.
- **Collapsible Accordion**: Collapsed by default, displaying an active filter count badge and a "Clear filters" button.
- **Live Filtering**: Map markers and list view update live as filters change, with active records deselected gracefully when filtered out.

---

### 5. Root Source File Structures

#### A. Multi-Layer Dataset (`MultiLayerResponse`)

If the root of the JSON file is an array where elements are layer envelopes or nested record arrays, each item represents an independent layer:

```typescript
type LayerEnvelope = {
  /** Name of the layer displayed in the layers modal (defaults to "Layer {index + 1}") */
  title?: string;

  /** Layer-specific metadata, aggregated in the data source information modal */
  metadata?: string | string[];

  /** Records belonging to this layer */
  records: PointOfInterest[];

  /** Optional layer-specific configuration */
  config?: Config;

  /** Optional layer-specific filter definitions */
  filters?: FilterDefinition[];
};

// Root structure for multi-layer data:
type MultiLayerResponse = Array<LayerEnvelope | PointOfInterest[]>;
```

**Features when multiple layers are present:**

- A dedicated **Layers** button (stacked-sheets icon) appears directly below the zoom controls.
- Clicking the button opens a modal with checkboxes showing each layer title and record count.
- Toggling a layer immediately updates the map markers, bottom list view, and fuzzy search results.
- Unchecking all layers is supported (clears the map view).
- The information modal aggregates metadata across all currently active layers.
- Current zoom and pan are preserved when toggling layers.

#### B. Single Enveloped Dataset (`CustomRecordWithMetadata`)

```typescript
type SingleEnvelopedDataset = {
  /** Dataset label in the dataset switcher dropdown (when multiple ?api= params exist) */
  title?: string;

  /** Information displayed in the info button modal */
  metadata?: string | string[];

  /** Map configuration options */
  config?: Config;

  /** Optional filter definitions for this dataset */
  filters?: FilterDefinition[];

  /** Array of POIs */
  records: PointOfInterest[];
};
```

#### C. Flat POI Array

A direct array of POIs with default settings:

```typescript
type FlatResponse = PointOfInterest[];
```

---

## URL Parameters

- `?api=` - Specifies the API endpoint or JSON file to load POI data from. Can be repeated to provide multiple datasets (e.g. `?api=...&api=...`), selectable from a dropdown below the search input. The dropdown label is resolved from the dataset `title`, then the first `metadata` entry, then the URL itself
- `?selected=` - Zero-based index of the selected dataset when multiple `api` values are provided (defaults to `0`)
- `?id=` - Focuses on a specific record by its ID and opens its details panel

**Example URLs:**

- `/?api=/cities_in_romania.json` - Romanian cities (default icon, list enabled, zoom on select)
- `/?api=/multi_layer_sample.json` - Multi-layer sample demonstrating multiple layers with custom marker colors (`Romanian Landmarks`, `Space & Science Centers`, and `Nature & Parks`) and the layer selector modal
- `/?api=/cities_in_romania.json&id=id_1` - Load demo data and focus on Cluj-Napoca (second record)
- `/?api=/cultural_landmarks_paris.json` - Paris landmarks demonstrating `typeOfIcon: "text"`, custom `color` hexes, `images` galleries, and `isZoomOnSelectEnabled: true`
- `/?api=/national_parks.json` - Iconic world national parks demonstrating `isListFilteredToViewport: true`, `isShowOnlyURLRecordEnabled: false`, and `typeOfIcon: "dot"`
- `/?api=/space_launch_sites.json` - Global spaceports demonstrating `isListEnabled: false` (clean map view without bottom drawer) and `isAggressiveOptimizationEnabled: true`
- `/?api=/cities_in_romania.json&api=/multi_layer_sample.json&api=/world_cities.json&api=/cultural_landmarks_paris.json&api=/national_parks.json&api=/space_launch_sites.json` - Load all demo datasets and switch between them from the dropdown
- `/?api=https://your-api.com/pois.json&id=custom-poi-123` - Load from API and focus on specific record

**Note:** If your data doesn't include `id` fields, the system will automatically generate them using the pattern `id_0`, `id_1`, `id_2`, etc., ensuring unique IDs across records and layers.

### Allowing Custom API URLs (`config.json`)

- **Same-origin files** (such as `?api=all.json` or `?api=/data/pois.json` hosted on the same domain as the app) are **allowed automatically**.
- **External URLs** are checked against `ALLOWED_API_URL_PATTERNS` in [`src/constants.ts`](src/constants.ts) and an optional, git-ignored `public/config.json` file (automatically generated from [`public/config.example.json`](public/config.example.json) during `npm run dev` / `npm run build`, and silently ignored if missing at runtime):

```json
{
  "allowedApiOrigins": ["https://api.example.com"],
  "allowedApiPatterns": ["^https://.*\\.example\\.com/.*$"]
}
```

---

## Install and First Run

- `npm i`
- `npm run dev`

## Architecture & Developer Skills

For in-depth architectural specifications and progressive disclosure guides:
- [System Architecture](.agents/architecture.md)
- [Design System & UI Style Guide](.agents/skills/design-system.md)
- [Leaflet Maps & Geospatial Implementation](.agents/skills/leaflet-maps.md)
- [React Components & Atomic Design](.agents/skills/react-components.md)
- [Zod Validation & Security](.agents/skills/zod-validation.md)
- [Biome Quality Pipeline](.agents/skills/tooling-biome.md)

## Development

### Code Formatting and Linting

This project uses [Biome](https://biomejs.dev/) as the sole tool for code formatting and linting.

**Available commands:**

- `npm run lint` - Check for linting errors
- `npm run format` - Format code
- `npm run check:biome` - Check formatting and linting with autofix
- `npm run check:tsc` - Strict TypeScript type checking (`tsc --noEmit`)
- `npm run check` - Run both Biome check and TypeScript type checking (recommended)

**VS Code Setup:**

1. Install the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
2. Add to your workspace settings (`.vscode/settings.json`):

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

### Devcontainer

You can open this project in a devcontainer by:

- Opening VS Code Command Palette (Cmd+Shift+P)
- Running "Dev Containers: Reopen in Container"

## Icons

We are using FontAwesome SVG icons: [https://fontawesome.com/search](https://fontawesome.com/search)

## Data Sources

- **World Cities**: The dataset for world cities is provided by [joelacus/world-cities](https://github.com/joelacus/world-cities), licensed under CC-BY 4.0.
