import { useState, useCallback, useEffect, useRef } from 'react'
import L, { LatLngBounds, LatLngTuple, Map as MapType } from 'leaflet'
import { MAP_CONFIG } from '@/constants'
import debounce from '@/utils/debounce'
import throttle from '@/utils/throttle'

const useMap = () => {
  const [currentMapBounds, setCurrentMapBounds] = useState<LatLngBounds | null>(
    null,
  )
  const [map, setMap] = useState<MapType | null>(null)

  const [isZoomInDisabled, setIsZoomInDisabled] = useState(false)
  const [isZoomOutDisabled, setIsZoomOutDisabled] = useState(false)

  const debouncedBoundsUpdateRef = useRef(
    debounce((map: MapType) => {
      const bounds = map.getBounds()
      setCurrentMapBounds(bounds)

      const currentZoom = map.getZoom()
      const maxZoom = map.getMaxZoom()

      setIsZoomOutDisabled(currentZoom === 0)
      setIsZoomInDisabled(currentZoom === maxZoom)
    }, 100),
  )
  const throttledMapRefreshRef = useRef(
    throttle((map: MapType) => {
      map.invalidateSize()
    }, 200),
  )

  // Get the current functions from the refs
  const debouncedBoundsUpdate = debouncedBoundsUpdateRef.current
  const throttledMapRefresh = throttledMapRefreshRef.current

  useEffect(() => {
    if (!map) return

    const updateBoundsAndZoom = () => {
      debouncedBoundsUpdate(map)
    }

    updateBoundsAndZoom()

    map.on('zoomend', updateBoundsAndZoom)
    map.on('moveend', updateBoundsAndZoom)

    return () => {
      map.off('zoomend', updateBoundsAndZoom)
      map.off('moveend', updateBoundsAndZoom)
    }
  }, [map, debouncedBoundsUpdate])

  const handleMapRefresh = useCallback(() => {
    if (!map) return

    throttledMapRefresh(map)
  }, [map, throttledMapRefresh])

  const handleZoomIn = useCallback(() => {
    if (!map) return

    map.zoomIn()
  }, [map])

  const handleZoomOut = useCallback(() => {
    if (!map) return

    map.zoomOut()
  }, [map])

  const handleSetBounds = useCallback(
    (coords: LatLngTuple[]) => {
      if (!map || !coords) return

      const bounds = L.latLngBounds(coords).pad(MAP_CONFIG.BOUNDS_PADDING)

      map.fitBounds(bounds)
      map.setMaxBounds(bounds)
    },
    [map],
  )

  return {
    map,
    setMap,
    handleMapRefresh,
    isZoomInDisabled,
    isZoomOutDisabled,
    handleZoomIn,
    handleZoomOut,
    handleSetBounds,
    currentMapBounds,
  }
}

export default useMap
