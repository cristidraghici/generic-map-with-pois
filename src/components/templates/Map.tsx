// React and third-party imports
import { useState } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'

// Fix for github pages not showing the icon
L.Marker.prototype.options.icon = createSvgIcon()

// Components
import Drawer from '@/components/atoms/Drawer'
import POIDetails from '@/components/molecules/POIDetails'
import MarkerElement from '@/components/molecules/MarkerElement'
import MapControls from '@/components/organisms/MapControls'
import SearchSection from '@/components/organisms/SearchSection'

// Hooks
import useGetPOIs from '@/hooks/useGetPOIs'
import useURLParams from '@/hooks/useURLParams'
import useMap from '@/hooks/useMap'

// Types
import { CustomMarker } from '@/types'
import createSvgIcon from '@/utils/createSvgIcon'

// Constants
const MAP_TILE_LAYER = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}

/**
 * Map Component
 *
 * Displays an interactive map with Points of Interest (POIs).
 * Features include:
 * - Search functionality
 * - Marker clustering
 * - POI details modal
 * - Map controls (zoom, refresh, bounds)
 */
function Map() {
  const URLParams = useURLParams()

  // Search state and handlers
  const [search, setSearch] = useState<string>('')
  const handleSearchChange = (value: string) => setSearch(value)
  const handleSearchCancel = () => setSearch('')

  // POI selection state and handlers
  const [selectedPOI, setSelectedPoi] = useState<CustomMarker | null>(null)
  const handlePOISelect = (poi: CustomMarker) => setSelectedPoi(poi)
  const handleModalClose = () => setSelectedPoi(null)

  // Custom hooks for data and map management
  const { records, metadata, loading, error, reload } = useGetPOIs(
    URLParams.api || undefined,
    search,
  )
  const {
    map,
    setMap,
    setMapBounds,
    isZoomInDisabled,
    isZoomOutDisabled,
    config,
  } = useMap(records)

  return (
    <>
      <SearchSection
        search={search}
        loading={loading}
        error={error}
        api={URLParams.api}
        onSearchChange={handleSearchChange}
        onSearchCancel={handleSearchCancel}
      />

      <MapContainer
        {...config}
        style={{ height: '100vh' }}
        ref={setMap}
        zoomControl={false}
      >
        <TileLayer {...MAP_TILE_LAYER} />

        <MarkerClusterGroup>
          {records.map((poi, index) => (
            <MarkerElement
              key={index}
              marker={poi}
              onClick={() => handlePOISelect(poi)}
              color={Array.isArray(poi.description) ? 'green' : 'blue'}
            >
              <POIDetails
                className="max-w-[300px]"
                {...poi}
                maxLines={5}
                showImages={false}
              />
            </MarkerElement>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <MapControls
        map={map}
        isZoomInDisabled={isZoomInDisabled}
        isZoomOutDisabled={isZoomOutDisabled}
        loading={loading}
        metadata={metadata}
        onRefresh={reload}
        setMapBounds={setMapBounds}
      />

      <Drawer isOpen={selectedPOI !== null} onClose={handleModalClose}>
        {selectedPOI && <POIDetails {...selectedPOI} />}
      </Drawer>
    </>
  )
}

export default Map
