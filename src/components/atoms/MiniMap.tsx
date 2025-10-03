import { MapContainer, TileLayer } from 'react-leaflet'
import MarkerElement from '../molecules/MarkerElement'
import { MARKER_COLORS } from '@/constants'
import 'leaflet/dist/leaflet.css'

interface MiniMapProps {
  latitude: number
  longitude: number
  zoom?: number
  className?: string
}

export const MiniMap = ({
  latitude,
  longitude,
  zoom = 15,
  className = '',
}: MiniMapProps) => {
  const position: [number, number] = [latitude, longitude]

  return (
    <div
      className={`${className} pdf-page-break-before mb-4 mt-4 h-40 w-full overflow-hidden rounded-md border border-gray-200`}
    >
      <MapContainer
        center={position}
        zoom={zoom}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        touchZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MarkerElement
          record={{ latitude, longitude }}
          color={MARKER_COLORS.blue}
          icon="default"
        />
      </MapContainer>
    </div>
  )
}
