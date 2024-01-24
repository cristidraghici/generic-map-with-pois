import { useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

import ConditionalElement from './components/ConditionalElement'
import ButtonWrapper from './components/ButtonWrapper'
import MapButton from './components/MapButton'
import SearchInput from './components/SearchInput'
import MarkerElement from './components/MarkerElement'
import POIDetails from './components/POIDetails'

import Modal from './components/Modal'
import Tooltip from './components/Tooltip'

import useGetPOIs from './hooks/useGetPOIs'
import useURLParams from './hooks/useURLParams'
import useMap from './hooks/useMap'

import defaultIcon from './utils/defaultIcon'

import { ReactComponent as IconPlusSVG } from './assets/icons/plus.svg'
import { ReactComponent as IconMinusSVG } from './assets/icons/minus.svg'
import { ReactComponent as IconRefreshSVG } from './assets/icons/refresh.svg'
import { ReactComponent as IconInfoSVG } from './assets/icons/info.svg'

import 'leaflet/dist/leaflet.css'

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

function Map() {
  const URLParams = useURLParams()

  const [search, setSearch] = useState<string>('')
  const { records, metadata, loading, error, reload } = useGetPOIs(
    URLParams.api || undefined,
    search,
  )
  const { map, setMap, setMapBounds, isZoomInDisabled, isZoomOutDisabled } =
    useMap(records, BOUNDS_PADDING)

  const [selectedPOI, setSelectedPoi] = useState<CustomMarker | null>(null)

  return (
    <>
      <div className="absolute right-0 top-0 z-[999] w-[400px] max-w-full p-2 pl-[50px]">
        <SearchInput
          className="mb-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          onCancel={() => {
            setSearch('')
          }}
        />

        <ConditionalElement
          as="div"
          rcIf={!URLParams.api}
          className="rounded-md bg-white p-2 text-gray-800"
        >
          It appears you have not specified an <strong>?api=</strong> param. You
          can use the default meanwhile:
          <div className="pt-4">
            <a href="?api=/cities_in_romania.json">cities_in_romania.json</a>
          </div>
        </ConditionalElement>

        <ConditionalElement
          as="div"
          rcIf={loading}
          className="rounded-md bg-white p-2 text-gray-800"
        >
          The data for the map is loading...
        </ConditionalElement>

        <ConditionalElement
          as="div"
          rcIf={!loading && !!error}
          className="rounded-md border-red-500 bg-white p-2 text-red-800"
        >
          {error}
        </ConditionalElement>
      </div>

      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        style={{ height: '100vh' }}
        ref={setMap}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MarkerClusterGroup chunkedLoading>
          {records.map((poi, index) => (
            <MarkerElement
              key={index}
              marker={poi}
              onClick={() => setSelectedPoi(poi)}
            >
              <POIDetails {...poi} />
            </MarkerElement>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <Modal
        isOpen={selectedPOI !== null}
        onClose={() => {
          setSelectedPoi(null)
        }}
      >
        {selectedPOI && <POIDetails {...selectedPOI} />}
      </Modal>

      <ButtonWrapper className="absolute left-[10px] top-[10px]">
        <MapButton
          onClick={() => map && map.zoomIn()}
          disabled={isZoomInDisabled}
        >
          <IconPlusSVG width={15} height={15} />
        </MapButton>
        <MapButton
          onClick={() => map && map.zoomOut()}
          disabled={isZoomOutDisabled}
        >
          <IconMinusSVG width={15} height={15} />
        </MapButton>
      </ButtonWrapper>

      <ButtonWrapper className="absolute left-[10px] top-[80px]">
        <MapButton
          onClick={() => {
            setSearch('')
            reload()
            // fallback for when the data is locally loaded
            setMapBounds()
          }}
          disabled={loading}
        >
          <IconRefreshSVG width={15} height={15} />
        </MapButton>
      </ButtonWrapper>

      <ConditionalElement rcIf={!!metadata}>
        <ButtonWrapper className="absolute left-[10px] top-[120px]">
          <Tooltip text={metadata} className="w-[240px] text-left">
            <MapButton className="!bg-transparent">
              <IconInfoSVG width={15} height={15} />
            </MapButton>
          </Tooltip>
        </ButtonWrapper>
      </ConditionalElement>
    </>
  )
}

export default Map
