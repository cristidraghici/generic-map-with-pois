import { CustomRecord } from '@/types'
import L, { LatLngBounds } from 'leaflet'

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
 *
 * This is kept as an idea but
 */
export const reduceVisibleRecords = (
  records: CustomRecord[],
  currentMapBounds: LatLngBounds | null,
  currentZoom: number | undefined,
) => {
  if (!currentMapBounds) {
    return []
  }

  // For large datasets, filter markers to only show those in or near the current viewport
  const paddingFactor = 1.5 // Show markers 1.5x outside the current bounds
  const extendedBounds = currentMapBounds.pad(paddingFactor)

  // Get center of the current viewport for distance calculation
  const center = currentMapBounds.getCenter()

  // Filter records by bounds first, then sort by distance to center
  const filteredRecords = records.filter((record) => {
    const markerLatLng = L.latLng(record.latitude, record.longitude)
    return extendedBounds.contains(markerLatLng)
  })

  // Sort by distance from center (closer markers load first)
  filteredRecords.sort((a, b) => {
    const distanceA = center.distanceTo(L.latLng(a.latitude, a.longitude))
    const distanceB = center.distanceTo(L.latLng(b.latitude, b.longitude))
    return distanceA - distanceB
  })

  // Level-of-detail: reduce markers at lower zoom levels
  let maxVisibleMarkers = 2000
  if (currentZoom !== undefined) {
    if (currentZoom < 8) {
      maxVisibleMarkers = Math.min(filteredRecords.length, 500) // Very few at low zoom
    } else if (currentZoom < 10) {
      maxVisibleMarkers = Math.min(filteredRecords.length, 1000) // Moderate at medium zoom
    } else {
      maxVisibleMarkers = Math.min(filteredRecords.length, 2000) // Full at high zoom
    }
  }

  return filteredRecords.slice(0, maxVisibleMarkers)
}
