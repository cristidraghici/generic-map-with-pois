import { useState, useMemo, useCallback, useEffect } from 'react'
import L, { LatLngExpression, Map as MapType, LatLngBounds } from 'leaflet'
import { CustomMarker } from '../types'

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
  const [currentMapBounds, setCurrentMapBounds] = useState<LatLngBounds | null>(
    null,
  )
  const [map, setMap] = useState<MapType | null>(null)
  const [isZoomInDisabled, setIsZoomInDisabled] = useState(false)
  const [isZoomOutDisabled, setIsZoomOutDisabled] = useState(false)

  /**
   * Calculate bounds encompassing all markers
   */
  const allRecordsBounds: LatLngBounds = useMemo(
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
   * Filter records based on the current map viewport bounds
   */
  const visibleRecords = useMemo(() => {
    if (!currentMapBounds) {
      return records
    }
    return records.filter((record) =>
      currentMapBounds.contains([record.latitude, record.longitude]),
    )
  }, [records, currentMapBounds])

  /**
   * Adjust map view to fit all markers with padding
   */
  const setMapBounds = useCallback(() => {
    if (!map) return

    const paddedBounds = allRecordsBounds.pad(MAP_CONFIG.BOUNDS_PADDING)
    map.fitBounds(paddedBounds)
    map.setMaxBounds(paddedBounds)
    setCurrentMapBounds(map.getBounds()) // Update current bounds after fitting
  }, [map, allRecordsBounds])

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
    if (!map || !allRecordsBounds.isValid()) return

    setMapBounds()
  }, [map, allRecordsBounds, setMapBounds])

  useEffect(() => {
    if (!map) return

    const updateBoundsAndZoom = () => {
      const bounds = map.getBounds()
      setCurrentMapBounds(bounds)
      handleZoomChange(map)
    }

    updateBoundsAndZoom()

    map.on('zoomend', updateBoundsAndZoom)
    map.on('moveend', updateBoundsAndZoom)

    return () => {
      map.off('zoomend', updateBoundsAndZoom)
      map.off('moveend', updateBoundsAndZoom)
    }
  }, [map, handleZoomChange])

  return {
    map,
    visibleRecords,
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
