import { FunctionComponent, useState } from 'react'
import ButtonGroup from '../molecules/ButtonGroup'
import Button from '../atoms/Button'
import Modal from '../atoms/Modal'
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
  metadata?: string | string[]
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
  const [isInfoOpen, setIsInfoOpen] = useState(false)

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
          <Modal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)}>
            {!!metadata &&
              (!Array.isArray(metadata) ? (
                <div className="text-gray-700">{metadata}</div>
              ) : (
                <ul className="mt-2 space-y-3 text-gray-700 [&>*:last-child]:border-0">
                  {metadata.map((item, key) => (
                    <li
                      className="break-words border-b border-gray-200 pb-3"
                      key={key}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ))}
          </Modal>

          <Button
            variant="transparent"
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            icon={
              <IconInfoSVG width={15} height={15} className="fill-current" />
            }
          />
        </ButtonGroup>
      )}
    </>
  )
}

export default MapControls
