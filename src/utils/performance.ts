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
