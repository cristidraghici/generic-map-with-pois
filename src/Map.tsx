// React and third-party imports
import { useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'

// Components
import Modal from './components/Modal'
import POIDetails from './components/POIDetails'
import MarkerElement from './components/MarkerElement'
import MapControls from './components/MapControls'
import SearchSection from './components/SearchSection'

// Hooks
import useGetPOIs from './hooks/useGetPOIs'
import useURLParams from './hooks/useURLParams'
import useMap from './hooks/useMap'

// Types
import { CustomMarker } from './types'

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
      <div className="absolute right-0 top-0 z-[999] w-[400px] max-w-full p-2 pl-[50px]">
        <SearchSection
          search={search}
          loading={loading}
          error={error}
          api={URLParams.api}
          onSearchChange={handleSearchChange}
          onSearchCancel={handleSearchCancel}
        />
      </div>

      <MapContainer
        {...config}
        style={{ height: '100vh' }}
        ref={setMap}
        zoomControl={false}
      >
        <TileLayer {...MAP_TILE_LAYER} />

        <MarkerClusterGroup chunkedLoading>
          {records.map((poi, index) => (
            <MarkerElement
              key={index}
              marker={poi}
              onClick={() => handlePOISelect(poi)}
            >
              <POIDetails {...poi} />
            </MarkerElement>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <MapControls
        map={map}
        isZoomInDisabled={isZoomInDisabled}
        isZoomOutDisabled={isZoomOutDisabled}
        loading={loading}
        metadata={typeof metadata === 'string' ? metadata : metadata[0]}
        onRefresh={reload}
        setMapBounds={setMapBounds}
      />

      <Modal isOpen={selectedPOI !== null} onClose={handleModalClose}>
        {selectedPOI && <POIDetails {...selectedPOI} />}
      </Modal>
    </>
  )
}

export default Map
