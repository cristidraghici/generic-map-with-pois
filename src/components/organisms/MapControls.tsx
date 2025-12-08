import { FunctionComponent, useState } from 'react'
import { ReactComponent as IconInfoSVG } from '@/assets/icons/info.svg'
import { ReactComponent as IconMinusSVG } from '@/assets/icons/minus.svg'

import { ReactComponent as IconPlusSVG } from '@/assets/icons/plus.svg'
import { ReactComponent as IconRefreshSVG } from '@/assets/icons/refresh.svg'
import Modal from '../atoms/Modal'
import ButtonGroup from '../molecules/ButtonGroup'
import ButtonWithTooltip from '../molecules/ButtonWithTooltip'

interface MapControlsProps {
  isZoomInDisabled: boolean
  isZoomOutDisabled: boolean
  loading: boolean
  metadata?: string | string[]
  onRefresh: () => void
  handleZoomIn: () => void
  handleZoomOut: () => void
}

const MapControls: FunctionComponent<MapControlsProps> = ({
  isZoomInDisabled,
  isZoomOutDisabled,
  loading,
  metadata,
  onRefresh,
  handleZoomIn,
  handleZoomOut,
}) => {
  const handleRefresh = () => {
    onRefresh()
  }
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  return (
    <>
      <ButtonGroup className="absolute left-[10px] top-[10px]">
        <ButtonWithTooltip
          tooltip="Zoom in"
          variant="transparent"
          onClick={() => handleZoomIn()}
          disabled={isZoomInDisabled}
          icon={<IconPlusSVG width={15} height={15} className="fill-current" />}
        />
        <ButtonWithTooltip
          tooltip="Zoom out"
          variant="transparent"
          onClick={() => handleZoomOut()}
          disabled={isZoomOutDisabled}
          icon={
            <IconMinusSVG width={15} height={15} className="fill-current" />
          }
        />
      </ButtonGroup>

      <ButtonGroup className="absolute left-[10px] top-[80px]">
        <ButtonWithTooltip
          tooltip="Refresh"
          variant="transparent"
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

          <ButtonWithTooltip
            tooltip="Show data source information"
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
