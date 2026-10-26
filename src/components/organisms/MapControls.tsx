import { FunctionComponent, useState } from 'react'
import { ReactComponent as IconInfoSVG } from '@/assets/icons/info.svg'
import { ReactComponent as IconLayersSVG } from '@/assets/icons/layers.svg'
import { ReactComponent as IconMinusSVG } from '@/assets/icons/minus.svg'
import { ReactComponent as IconPlusSVG } from '@/assets/icons/plus.svg'
import { ReactComponent as IconRefreshSVG } from '@/assets/icons/refresh.svg'
import { Layer } from '@/types'
import { linkifyText } from '@/utils/linkifyText'
import Modal from '../atoms/Modal'
import ButtonGroup from '../molecules/ButtonGroup'
import ButtonWithTooltip from '../molecules/ButtonWithTooltip'

interface MapControlsProps {
  isZoomInDisabled: boolean
  isZoomOutDisabled: boolean
  loading: boolean
  metadata?: string | string[]
  layers?: Layer[]
  visibleLayerIds?: string[]
  onToggleLayer?: (_layerId: string) => void
  onRefresh: () => void
  handleZoomIn: () => void
  handleZoomOut: () => void
}

const MapControls: FunctionComponent<MapControlsProps> = ({
  isZoomInDisabled,
  isZoomOutDisabled,
  loading,
  metadata,
  layers = [],
  visibleLayerIds = [],
  onToggleLayer,
  onRefresh,
  handleZoomIn,
  handleZoomOut,
}) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isLayersOpen, setIsLayersOpen] = useState(false)

  const hasMultipleLayers = layers.length > 1

  return (
    <>
      <div className="absolute left-[10px] top-[10px] z-[998] flex flex-col gap-2.5">
        <ButtonGroup>
          <ButtonWithTooltip
            tooltip="Zoom in"
            variant="transparent"
            onClick={() => handleZoomIn()}
            disabled={isZoomInDisabled}
            icon={
              <IconPlusSVG width={15} height={15} className="fill-current" />
            }
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

        {hasMultipleLayers && (
          <ButtonGroup>
            <ButtonWithTooltip
              tooltip="Select visible layers"
              variant="transparent"
              onClick={() => setIsLayersOpen(true)}
              icon={
                <IconLayersSVG
                  width={15}
                  height={15}
                  className="fill-current"
                />
              }
            />
          </ButtonGroup>
        )}

        <ButtonGroup>
          <ButtonWithTooltip
            tooltip="Refresh"
            variant="transparent"
            onClick={onRefresh}
            disabled={loading}
            icon={
              <IconRefreshSVG width={15} height={15} className="fill-current" />
            }
          />
        </ButtonGroup>

        {metadata && (
          <ButtonGroup>
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
      </div>

      {hasMultipleLayers && (
        <Modal isOpen={isLayersOpen} onClose={() => setIsLayersOpen(false)}>
          <div className="p-1">
            <h3 className="mb-4 text-base font-semibold text-gray-800">
              Map Layers
            </h3>
            <div className="space-y-3">
              {layers.map((layer) => {
                const isChecked = visibleLayerIds.includes(layer.id)
                return (
                  <label
                    key={layer.id}
                    className="flex cursor-pointer items-center space-x-3 text-sm text-gray-700 select-none hover:text-gray-900"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleLayer?.(layer.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium">{layer.title}</span>
                    <span className="text-xs text-gray-400">
                      ({layer.records.length})
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        </Modal>
      )}

      {metadata && (
        <Modal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)}>
          {!Array.isArray(metadata) ? (
            <div className="text-gray-700">{linkifyText(metadata)}</div>
          ) : (
            <ul className="mt-2 space-y-3 text-gray-700 [&>*:last-child]:border-0">
              {metadata.map((item, key) => (
                <li
                  className="break-words border-b border-gray-200 pb-3"
                  key={key}
                >
                  {linkifyText(item)}
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </>
  )
}

export default MapControls
