import { Map as MapType } from 'leaflet'
import ButtonWrapper from './ButtonWrapper'
import MapButton from './MapButton'
import Tooltip from './Tooltip'
import { ReactComponent as IconPlusSVG } from '../assets/icons/plus.svg'
import { ReactComponent as IconMinusSVG } from '../assets/icons/minus.svg'
import { ReactComponent as IconRefreshSVG } from '../assets/icons/refresh.svg'
import { ReactComponent as IconInfoSVG } from '../assets/icons/info.svg'

interface MapControlsProps {
  map: MapType | null
  isZoomInDisabled: boolean
  isZoomOutDisabled: boolean
  loading: boolean
  metadata?: string
  onRefresh: () => void
  setMapBounds: () => void
}

const MapControls = ({
  map,
  isZoomInDisabled,
  isZoomOutDisabled,
  loading,
  metadata,
  onRefresh,
  setMapBounds,
}: MapControlsProps) => {
  const handleRefresh = () => {
    onRefresh()
    // fallback for when the data is locally loaded
    setMapBounds()
  }

  return (
    <>
      <ButtonWrapper className="absolute left-[10px] top-[10px]">
        <MapButton
          onClick={() => map && map.zoomIn()}
          disabled={isZoomInDisabled}
          icon={<IconPlusSVG width={15} height={15} className="fill-current" />}
        />
        <MapButton
          onClick={() => map && map.zoomOut()}
          disabled={isZoomOutDisabled}
          icon={
            <IconMinusSVG width={15} height={15} className="fill-current" />
          }
        />
      </ButtonWrapper>

      <ButtonWrapper className="absolute left-[10px] top-[80px]">
        <MapButton
          onClick={handleRefresh}
          disabled={loading}
          icon={
            <IconRefreshSVG width={15} height={15} className="fill-current" />
          }
        />
      </ButtonWrapper>

      {metadata && (
        <ButtonWrapper className="absolute left-[10px] top-[120px]">
          <Tooltip tooltip={metadata} className="w-[240px] text-left">
            <MapButton
              className="!bg-transparent"
              icon={
                <IconInfoSVG width={15} height={15} className="fill-current" />
              }
            />
          </Tooltip>
        </ButtonWrapper>
      )}
    </>
  )
}

export default MapControls
