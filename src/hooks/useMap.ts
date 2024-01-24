import { useState, useMemo, useCallback, useEffect } from 'react'
import L, { LatLngExpression, Map as MapType } from 'leaflet'

import defaultIcon from '../utils/defaultIcon'

// Fix for github pages not showing the icon
L.Marker.prototype.options.icon = defaultIcon

/**
 * The default center of the map (currently Bucharest :) )
 */
const MAP_CENTER: LatLngExpression = [44.4268, 26.1025]

/**
 * The initial zoom of the map
 */
const MAP_ZOOM = 3

/**
 * Padding for the bounds
 */
const BOUNDS_PADDING = 0.2

const useMap = (records: CustomMarker[]) => {
  const [map, setMap] = useState<MapType | null>(null)
  const [isZoomInDisabled, setIsZoomInDisabled] = useState(false)
  const [isZoomOutDisabled, setIsZoomOutDisabled] = useState(false)

  const bounds = useMemo(
    () =>
      L.latLngBounds(
        records.map<LatLngExpression>((poi) => [poi.latitude, poi.longitude]),
      ),
    [records],
  )

  const setMapBounds = useCallback(() => {
    if (!map) {
      return
    }

    map.fitBounds(bounds.pad(BOUNDS_PADDING))
    map.setMaxBounds(bounds.pad(BOUNDS_PADDING))
  }, [map, bounds])

  useEffect(() => {
    if (!map || !bounds.isValid()) {
      return
    }

    const setBoundsTimeout = setTimeout(() => setMapBounds(), 1000)

    return () => clearTimeout(setBoundsTimeout)
  }, [map, bounds, setMapBounds])

  useEffect(() => {
    if (!map) {
      return
    }

    map.on('zoom', () => {
      const zoom = map.getZoom()
      const maxZoom = map.getMaxZoom()

      setIsZoomOutDisabled(zoom === 0)
      setIsZoomInDisabled(zoom === maxZoom)
    })
  }, [map])

  return {
    map,
    setMap,
    setMapBounds,
    isZoomInDisabled,
    isZoomOutDisabled,
    config: {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
    },
  }
}

export default useMap
