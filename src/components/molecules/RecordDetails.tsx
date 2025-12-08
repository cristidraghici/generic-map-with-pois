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
import { MiniMap } from '../atoms/MiniMap'
import { ShareableLinkSection } from '../atoms/ShareableLinkSection'
import ImageGallery from './ImageGallery'

type RecordDetailsProps = PropsWithChildren<
  ComponentProps<'div'> &
    CustomRecord & {
      maxLines?: number
      showImages?: boolean
      showMinimap?: boolean
      showTitle?: boolean
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
  const miniMapRef = useRef<LeafletMap | null>(null)
  const [
    isPageBreakBeforeMediaInPDFEnabled,
    setIsPageBreakBeforeMediaInPDFEnabled,
  ] = useState(false)

  return (
    <div className={`RecordDetails mb-4 overflow-hidden p-1 ${className}`}>
      <h3 className="mb-4 text-xl font-bold">{title}</h3>

      {!!description &&
        (!Array.isArray(description) ? (
          <div className="text-gray-700">{description}</div>
        ) : (
          <ul className="mt-2 space-y-3 text-gray-700 [&>*:last-child]:border-0">
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
              const mapContainer = miniMapRef.current?.getContainer()
              if (mapContainer) {
                // Store the current width so we can restore it later
                mapContainer.dataset.originalWidth = mapContainer.style.width

                // Temporarily enlarge the map before PDF capture
                mapContainer.style.width = '800px'
                miniMapRef.current?.invalidateSize()
              }
            }}
            onAfterGenerate={() => {
              const mapContainer = miniMapRef.current?.getContainer()
              if (mapContainer) {
                // Restore the original width
                mapContainer.style.width =
                  mapContainer.dataset.originalWidth || ''
                delete mapContainer.dataset.originalWidth
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
