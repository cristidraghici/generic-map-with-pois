import { useState, useMemo, useCallback, useEffect } from 'react'
import L, { LatLngExpression, Map as MapType } from 'leaflet'

const useMap = (records: CustomMarker[], bounds_padding: number) => {
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

    map.fitBounds(bounds.pad(bounds_padding))
    map.setMaxBounds(bounds.pad(bounds_padding))
  }, [map, bounds, bounds_padding])

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

  return { map, setMap, setMapBounds, isZoomInDisabled, isZoomOutDisabled }
}

export default useMap
