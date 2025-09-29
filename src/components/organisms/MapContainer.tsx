import { useMemo } from 'react'
import L from 'leaflet'
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MAP_CONFIG, MAP_TILE_LAYER, MARKER_COLORS } from '@/constants'
import RecordDetails from '@/components/molecules/RecordDetails'
import MarkerElement from '@/components/molecules/MarkerElement'
import createSvgIcon from '@/utils/icons/createSvgIcon'
import {
  getOptimalClusterRadius,
  performanceMonitor,
} from '@/utils/performance'

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
  const clusterOptions = useMemo(() => {
    return {
      chunkedLoading: true,
      chunkInterval: 200,
      chunkDelay: 50,
      maxClusterRadius: getOptimalClusterRadius(records.length),
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      animate: true,
    }
  }, [records.length])

  const recordMarkers = useMemo<
    (CustomRecord & {
      icon: Config['typeOfIcon']
      color: (typeof MARKER_COLORS)[keyof typeof MARKER_COLORS]
    })[]
  >(() => {
    return records.map((record) => {
      return {
        ...record,
        icon:
          icon === 'text' && (!record.title || record.title.length === 0)
            ? 'default'
            : icon,
        color: Array.isArray(record.description)
          ? MARKER_COLORS.green
          : MARKER_COLORS.blue,
      }
    })
  }, [records, icon])

  const startTime = performance.now()

  return (
    <LeafletMapContainer
      ref={(map) => {
        setMap(map)

        if (map) {
          const renderTime = performance.now() - startTime
          performanceMonitor.logRenderTime(renderTime, records.length)
        }
      }}
      center={MAP_CONFIG.CENTER}
      zoom={MAP_CONFIG.ZOOM}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      attributionControl={true}
      preferCanvas={true}
    >
      <TileLayer {...MAP_TILE_LAYER} />

      <MarkerClusterGroup {...clusterOptions}>
        {recordMarkers.map((record) => {
          return (
            <MarkerElement
              key={record.id}
              record={record}
              onClick={() => onRecordSelect(record)}
              color={record.color}
              icon={record.icon}
            >
              <RecordDetails
                className="max-w-[300px]"
                {...record}
                maxLines={5}
                showImages={false}
                showMinimap={false}
                showActions={false}
              />
            </MarkerElement>
          )
        })}
      </MarkerClusterGroup>
    </LeafletMapContainer>
  )
}

export default MapContainer
