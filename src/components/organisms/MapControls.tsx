import { FunctionComponent } from 'react'
import ButtonGroup from '../molecules/ButtonGroup'
import Button from '../atoms/Button'
import Tooltip from '../atoms/Tooltip'
import { Map as MapType } from 'leaflet'

import { ReactComponent as IconPlusSVG } from '@/assets/icons/plus.svg'
import { ReactComponent as IconMinusSVG } from '@/assets/icons/minus.svg'
import { ReactComponent as IconRefreshSVG } from '@/assets/icons/refresh.svg'
import { ReactComponent as IconInfoSVG } from '@/assets/icons/info.svg'

interface MapControlsProps {
  map: MapType | null
  isZoomInDisabled: boolean
  isZoomOutDisabled: boolean
  loading: boolean
  metadata?: string
  onRefresh: () => void
  setMapBounds: () => void
}

const MapControls: FunctionComponent<MapControlsProps> = ({
  map,
  isZoomInDisabled,
  isZoomOutDisabled,
  loading,
  metadata,
  onRefresh,
  setMapBounds,
}) => {
  const handleRefresh = () => {
    onRefresh()
    setMapBounds()
  }

  return (
    <>
      <ButtonGroup className="absolute left-[10px] top-[10px]">
        <Button
          onClick={() => map?.zoomIn()}
          disabled={isZoomInDisabled}
          icon={<IconPlusSVG width={15} height={15} className="fill-current" />}
        />
        <Button
          onClick={() => map?.zoomOut()}
          disabled={isZoomOutDisabled}
          icon={
            <IconMinusSVG width={15} height={15} className="fill-current" />
          }
        />
      </ButtonGroup>

      <ButtonGroup className="absolute left-[10px] top-[80px]">
        <Button
          onClick={handleRefresh}
          disabled={loading}
          icon={
            <IconRefreshSVG width={15} height={15} className="fill-current" />
          }
        />
      </ButtonGroup>

      {metadata && (
        <ButtonGroup className="absolute left-[10px] top-[120px]">
          <Tooltip tooltip={metadata} className="w-[240px] text-left">
            <Button
              variant="transparent"
              icon={
                <IconInfoSVG width={15} height={15} className="fill-current" />
              }
            />
          </Tooltip>
        </ButtonGroup>
      )}
    </>
  )
}

export default MapControls
