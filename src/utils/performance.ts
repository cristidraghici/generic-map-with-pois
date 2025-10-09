import { CustomRecord } from '@/types'
import { LatLngBounds } from 'leaflet'

interface PerformanceMetrics {
  renderTime: number
  markerCount: number
  boundsUpdateTime: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private maxMetrics = 100
  private warningThresholdInMs = 3000

  logRenderTime(renderTime: number, markerCount: number) {
    this.metrics.push({
      renderTime,
      markerCount,
      boundsUpdateTime: 0,
    })

    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    if (renderTime > this.warningThresholdInMs) {
      console.warn(
        `Slow render detected: ${renderTime}ms for ${markerCount} markers`,
      )
    }
  }

  logBoundsUpdateTime(updateTime: number) {
    if (this.metrics.length > 0) {
      this.metrics[this.metrics.length - 1].boundsUpdateTime = updateTime
    }
  }

  getAverageRenderTime(): number {
    if (this.metrics.length === 0) return 0
    const total = this.metrics.reduce(
      (sum, metric) => sum + metric.renderTime,
      0,
    )
    return total / this.metrics.length
  }

  getAverageMarkerCount(): number {
    if (this.metrics.length === 0) return 0
    const total = this.metrics.reduce(
      (sum, metric) => sum + metric.markerCount,
      0,
    )
    return total / this.metrics.length
  }

  clear() {
    this.metrics = []
  }
}

export const performanceMonitor = new PerformanceMonitor()

export const getOptimalClusterRadius = (markerCount: number): number => {
  if (markerCount > 10000) return 100
  if (markerCount > 5000) return 80
  if (markerCount > 1000) return 60
  return 40
}

/**
 * Reduces the number of visible records based on the current map bounds and zoom level.
 * This improves performance by limiting the number of markers rendered at once,
 * but also can give a less accurate representation of all data points.
 */
export const reduceVisibleRecords = (
  records: CustomRecord[],
  currentMapBounds: LatLngBounds | null,
  currentZoom = 10,
): CustomRecord[] => {
  if (!currentMapBounds || records.length === 0) return []

  // Slight padding to prevent "popping" at edges
  const extendedBounds = currentMapBounds.pad(1.2)
  const center = currentMapBounds.getCenter()
  const centerLat = center.lat
  const centerLng = center.lng

  // Adaptive limit by zoom (exponential scale)
  // Smooth transition from wide (low zoom) to detailed (high zoom)
  const base = 200
  const zoomFactor = 1.5
  const maxVisibleMarkers = Math.min(
    Math.floor(base * Math.pow(zoomFactor, currentZoom - 5)),
    8000,
  )

  const visible: { record: CustomRecord; distance: number }[] = []
  const south = extendedBounds.getSouth()
  const north = extendedBounds.getNorth()
  const west = extendedBounds.getWest()
  const east = extendedBounds.getEast()

  // Pre-filter to reduce candidate set
  for (let i = 0; i < records.length; i++) {
    const { latitude, longitude } = records[i]
    if (
      latitude >= south &&
      latitude <= north &&
      longitude >= west &&
      longitude <= east
    ) {
      visible.push({
        record: records[i],
        distance: (latitude - centerLat) ** 2 + (longitude - centerLng) ** 2, // squared distance (faster)
      })
    }
  }

  // If within budget, return directly
  if (visible.length <= maxVisibleMarkers) {
    return visible.map((v) => v.record)
  }

  // Otherwise, sort only the nearest ones (partial sort approximation)
  visible.sort((a, b) => a.distance - b.distance)
  return visible.slice(0, maxVisibleMarkers).map((v) => v.record)
}
