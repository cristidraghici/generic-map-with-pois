// React and third-party imports
import L from 'leaflet'
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MAP_CONFIG, MAP_TILE_LAYER, MARKER_COLORS } from '@/constants'
import RecordDetails from '@/components/molecules/RecordDetails'
import MarkerElement from '@/components/molecules/MarkerElement'
import createSvgIcon from '@/utils/createSvgIcon'
import { CustomRecord, Config } from '@/types'
import 'leaflet/dist/leaflet.css'

// Fix for github pages not showing the icon
L.Marker.prototype.options.icon = createSvgIcon()

type MapContainerProps = {
  setMap: React.Dispatch<React.SetStateAction<L.Map | null>>
  records: CustomRecord[]
  onRecordSelect: (_record: CustomRecord) => void
  icon: Config['typeOfIcon']
}

const MapContainer = ({
  setMap,
  records,
  onRecordSelect,
  icon,
}: MapContainerProps) => {
  return (
    <LeafletMapContainer
      ref={setMap}
      center={MAP_CONFIG.CENTER}
      zoom={MAP_CONFIG.ZOOM}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      attributionControl={true}
    >
      <TileLayer {...MAP_TILE_LAYER} />

      <MarkerClusterGroup>
        {records.map((record, index) => (
          <MarkerElement
            key={index}
            record={record}
            onClick={() => onRecordSelect(record)}
            color={
              Array.isArray(record.description)
                ? MARKER_COLORS.green
                : MARKER_COLORS.blue
            }
            icon={icon}
          >
            <RecordDetails
              className="max-w-[300px]"
              {...record}
              maxLines={5}
              showImages={false}
            />
          </MarkerElement>
        ))}
      </MarkerClusterGroup>
    </LeafletMapContainer>
  )
}

export default MapContainer
