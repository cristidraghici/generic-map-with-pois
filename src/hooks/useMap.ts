import L, { LatLngBounds, LatLngTuple, Map as MapType } from 'leaflet'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MAP_CONFIG } from '@/constants'
import debounce from '@/utils/debounce'
import throttle from '@/utils/throttle'

const useMap = () => {
  const [currentMapBounds, setCurrentMapBounds] = useState<LatLngBounds | null>(
    null,
  )
  const [currentZoom, setCurrentZoom] = useState<number>(MAP_CONFIG.ZOOM)
  const [map, setMap] = useState<MapType | null>(null)

  const [isZoomInDisabled, setIsZoomInDisabled] = useState(false)
  const [isZoomOutDisabled, setIsZoomOutDisabled] = useState(false)

  const debouncedBoundsUpdateRef = useRef(
    debounce((map: MapType) => {
      const bounds = map.getBounds()
      setCurrentMapBounds(bounds)

      const zoom = map.getZoom()
      const maxZoom = map.getMaxZoom()

      setCurrentZoom(zoom)
      setIsZoomOutDisabled(zoom === 0)
      setIsZoomInDisabled(zoom === maxZoom)
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

  const handleSetMaxBounds = useCallback(
    (coords: LatLngTuple[]) => {
      if (!map || !coords || coords.length === 0) return

      const bounds = L.latLngBounds(coords).pad(MAP_CONFIG.BOUNDS_PADDING)

      map.setMaxBounds(bounds)
    },
    [map],
  )

  const handleFitBounds = useCallback(
    (coords: LatLngTuple[]) => {
      if (!map || !coords || coords.length === 0) return

      const bounds = L.latLngBounds(coords).pad(MAP_CONFIG.BOUNDS_PADDING)

      map.fitBounds(bounds)
    },
    [map],
  )

  const handleSetBounds = useCallback(
    (coords: LatLngTuple[]) => {
      if (!map || !coords || coords.length === 0) return

      const bounds = L.latLngBounds(coords).pad(MAP_CONFIG.BOUNDS_PADDING)

      map.setMaxBounds(bounds)
      map.fitBounds(bounds)
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
    handleSetMaxBounds,
    handleFitBounds,
    handleSetBounds,
    currentMapBounds,
    currentZoom,
  }
}

export default useMap
