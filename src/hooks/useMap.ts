import { useState, useMemo, useCallback, useEffect } from 'react'
import L, { LatLngExpression, Map as MapType, LatLngBounds } from 'leaflet'
import defaultIcon from '../utils/defaultIcon'

// Fix for github pages not showing the icon
L.Marker.prototype.options.icon = defaultIcon

const MAP_CONFIG = {
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
  BOUNDS_PADDING: 0.2,
} as const

const useMap = (records: CustomMarker[]) => {
  const [map, setMap] = useState<MapType | null>(null)
  const [isZoomInDisabled, setIsZoomInDisabled] = useState(false)
  const [isZoomOutDisabled, setIsZoomOutDisabled] = useState(false)

  /**
   * Calculate bounds based on marker positions
   */
  const bounds: LatLngBounds = useMemo(
    () =>
      L.latLngBounds(
        records.map<LatLngExpression>((marker) => [
          marker.latitude,
          marker.longitude,
        ]),
      ),
    [records],
  )

  /**
   * Adjust map view to fit all markers with padding
   */
  const setMapBounds = useCallback(() => {
    if (!map) return

    const paddedBounds = bounds.pad(MAP_CONFIG.BOUNDS_PADDING)
    map.fitBounds(paddedBounds)
    map.setMaxBounds(paddedBounds)
  }, [map, bounds])

  /**
   * Handle zoom level changes and update zoom control states
   */
  const handleZoomChange = useCallback((map: MapType) => {
    const currentZoom = map.getZoom()
    const maxZoom = map.getMaxZoom()

    setIsZoomOutDisabled(currentZoom === 0)
    setIsZoomInDisabled(currentZoom === maxZoom)
  }, [])

  /**
   * Set initial bounds when map or markers change
   */
  useEffect(() => {
    if (!map || !bounds.isValid()) return

    const setBoundsTimeout = setTimeout(setMapBounds, 1000)
    return () => clearTimeout(setBoundsTimeout)
  }, [map, bounds, setMapBounds])

  /**
   * Set up zoom change listener
   */
  useEffect(() => {
    if (!map) return

    map.on('zoom', () => handleZoomChange(map))
    return () => {
      map.off('zoom')
    }
  }, [map, handleZoomChange])

  return {
    map,
    setMap,
    setMapBounds,
    isZoomInDisabled,
    isZoomOutDisabled,
    config: {
      center: MAP_CONFIG.CENTER,
      zoom: MAP_CONFIG.ZOOM,
    },
  }
}

export default useMap
