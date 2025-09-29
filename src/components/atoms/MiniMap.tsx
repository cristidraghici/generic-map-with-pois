import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import createSvgIcon from '@/utils/icons/createSvgIcon'

// Fix for marker icons
L.Marker.prototype.options.icon = createSvgIcon()

interface MiniMapProps {
  latitude: number
  longitude: number
  zoom?: number
  className?: string
}

const MiniMapContent = ({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}) => {
  const map = useMap()
  const markerRef = useRef<L.Marker>(null)

  useEffect(() => {
    if (markerRef.current) {
      map.setView([latitude, longitude], map.getZoom())
    }
  }, [latitude, longitude, map])

  return (
    <Marker
      ref={markerRef}
      position={[latitude, longitude]}
      interactive={false}
    />
  )
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
      className={`${className} mb-4 mt-4 h-40 w-full overflow-hidden rounded-md border border-gray-200`}
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
        <MiniMapContent latitude={latitude} longitude={longitude} />
      </MapContainer>
    </div>
  )
}
