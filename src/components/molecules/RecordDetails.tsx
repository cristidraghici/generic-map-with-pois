import type { Map as LeafletMap } from 'leaflet'
import {
  ComponentProps,
  FunctionComponent,
  PropsWithChildren,
  useRef,
  useState,
} from 'react'
import { linkifyText } from '@/utils/linkifyText'
import { CustomRecord } from '../../types'
import { DownloadPDFButton } from '../atoms/DownloadPDFButton'
import { ShareableLinkSection } from '../atoms/ShareableLinkSection'
import ImageGallery from './ImageGallery'
import { MiniMap } from './MiniMap'

type RecordDetailsProps = PropsWithChildren<
  ComponentProps<'div'> &
    CustomRecord & {
      maxLines?: number
      showImages?: boolean
      showMinimap?: boolean
      showActions?: boolean
    }
>

const RecordDetails: FunctionComponent<RecordDetailsProps> = ({
  id,
  title,
  description,
  images = [],
  className = '',
  maxLines = 0,
  showImages = true,
  showMinimap = true,
  showActions = true,
  latitude,
  longitude,
}): JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const miniMapRef = useRef<LeafletMap | null>(null)
  const [
    isPageBreakBeforeMediaInPDFEnabled,
    setIsPageBreakBeforeMediaInPDFEnabled,
  ] = useState(false)

  return (
    <div
      ref={containerRef}
      className={`RecordDetails overflow-hidden ${className}`}
    >
      <h3 className="mb-4 text-xl font-bold text-gray-900">{title}</h3>

      {!!description &&
        (!Array.isArray(description) ? (
          <div className="text-sm leading-relaxed text-gray-700">
            {linkifyText(description)}
          </div>
        ) : (
          <ul className="mt-2 space-y-3 text-sm leading-relaxed text-gray-700 [&>*:last-child]:border-0">
            {description
              .filter((_, key) => (maxLines > 0 ? key < maxLines : true))
              .map((item, key) => (
                <li
                  className="break-words border-b border-gray-200 pb-3"
                  key={key}
                >
                  {linkifyText(item)}
                </li>
              ))}
          </ul>
        ))}

      {showImages && (
        <ImageGallery
          images={images}
          isPageBreakBeforeMediaInPDFEnabled={
            isPageBreakBeforeMediaInPDFEnabled
          }
        />
      )}

      {showMinimap && (
        <MiniMap
          ref={miniMapRef}
          latitude={latitude}
          longitude={longitude}
          isPageBreakBeforeMediaInPDFEnabled={
            isPageBreakBeforeMediaInPDFEnabled
          }
        />
      )}

      {id && showActions && (
        <div className="RecordDetailsActionButtons">
          <ShareableLinkSection id={id} />

          <DownloadPDFButton
            selector=".RecordDetails"
            name={id}
            onBeforeGenerate={() => {
              const container = containerRef.current
              if (container) {
                container.dataset.originalWidth = container.style.width
                container.dataset.originalMaxWidth = container.style.maxWidth
                container.style.width = '750px'
                container.style.maxWidth = '750px'
              }

              const mapContainer = miniMapRef.current?.getContainer()
              const mapWrapper = mapContainer?.parentElement
              if (mapWrapper && mapContainer) {
                mapWrapper.dataset.originalHeight = mapWrapper.style.height
                mapWrapper.dataset.originalWidth = mapWrapper.style.width
                mapWrapper.style.width = '100%'
                mapWrapper.style.height = '320px'

                mapContainer.dataset.originalHeight = mapContainer.style.height
                mapContainer.dataset.originalWidth = mapContainer.style.width
                mapContainer.style.width = '100%'
                mapContainer.style.height = '320px'

                miniMapRef.current?.invalidateSize()
              }
            }}
            onAfterGenerate={() => {
              const container = containerRef.current
              if (container) {
                container.style.width = container.dataset.originalWidth || ''
                container.style.maxWidth =
                  container.dataset.originalMaxWidth || ''
                delete container.dataset.originalWidth
                delete container.dataset.originalMaxWidth
              }

              const mapContainer = miniMapRef.current?.getContainer()
              const mapWrapper = mapContainer?.parentElement
              if (mapWrapper && mapContainer) {
                mapWrapper.style.width = mapWrapper.dataset.originalWidth || ''
                mapWrapper.style.height =
                  mapWrapper.dataset.originalHeight || ''
                delete mapWrapper.dataset.originalWidth
                delete mapWrapper.dataset.originalHeight

                mapContainer.style.width =
                  mapContainer.dataset.originalWidth || ''
                mapContainer.style.height =
                  mapContainer.dataset.originalHeight || ''
                delete mapContainer.dataset.originalWidth
                delete mapContainer.dataset.originalHeight

                miniMapRef.current?.invalidateSize()
              }
            }}
            togglePageBreakBeforeMediaInPDF={() => {
              setIsPageBreakBeforeMediaInPDFEnabled((prev) => !prev)
            }}
            isPageBreakBeforeMediaInPDFEnabled={
              isPageBreakBeforeMediaInPDFEnabled
            }
          />
        </div>
      )}
    </div>
  )
}

export default RecordDetails
