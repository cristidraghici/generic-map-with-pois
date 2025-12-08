import { LatLngExpression } from 'leaflet'
import { Config } from './types'

export const MARKER_COLORS = {
  red: '#DC2626',
  blue: '#3B82F6',
  green: '#10B981',
} as const

/**
 * Regular expressions for validating API URLs
 * Acts as a basic security measure against malicious URLs
 */
export const ALLOWED_API_URL_PATTERNS: RegExp[] = [
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, // Matches pages URLs, e.g. Github
  /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?([/\w .-]*)*\/?$/, // Matches localhost and IP
]

export const ROMANIAN_CITIES_MOCK_DATA_PATH = '/cities_in_romania.json'

export const WORLD_CITIES_MOCK_DATA_PATH = '/world_cities.json'

export const AVAILABLE_DATASETS = [
  {
    label: 'Romania Cities',
    value: ROMANIAN_CITIES_MOCK_DATA_PATH,
  },
  {
    label: 'World Cities (Top 5000)',
    value: WORLD_CITIES_MOCK_DATA_PATH,
  },
] as const

export const DEFAULT_CONFIG: Config = {
  typeOfIcon: 'default',
  isListEnabled: true,
  isZoomOnSelectEnabled: false,
  isListFilteredToViewport: false,
  isShowOnlyURLRecordEnabled: true,
  isAggressiveOptimizationEnabled: false,
} as const

export const MAP_CONFIG = {
  /**
   * The default center of the map (Bucharest, Romania)
   */
  CENTER: [44.4268, 26.1025] as LatLngExpression,

  /**
   * The initial zoom level of the map
   */
  ZOOM: 3,

  /**
   * Padding factor for map bounds (20% padding)
   */
  BOUNDS_PADDING: 0.6,
} as const

export const MAP_TILE_LAYER = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
} as const

/**
 * Fuzzy (Levenshtein) search configuration
 */
export const FUZZY_SEARCH_CONFIG = {
  enabled: true, // toggle fuzzy search on/off
  maxDistance: 2, // absolute maximum Levenshtein distance allowed
  useRelative: true, // whether to compute a relative threshold based on query length
  maxRelativeDistance: 0.25, // maximum fraction (0-1) of query length allowed as distance
} as const
