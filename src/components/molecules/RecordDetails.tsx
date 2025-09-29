import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react'
import { CustomRecord } from '../../types'
import { linkifyText } from '@/utils/linkifyText'
import ImageGallery from './ImageGallery'
import { ShareableLink } from '../atoms/ShareableLink'
import { DownloadButton } from '../atoms/DownloadButton'
import { MiniMap } from '../atoms/MiniMap'

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
  return (
    <div className={`RecordDetails overflow-hidden ${className}`}>
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

      {showImages && <ImageGallery images={images} />}
      {showMinimap && <MiniMap latitude={latitude} longitude={longitude} />}

      {id && showActions && (
        <div className="RecordDetailsActionButtons">
          <ShareableLink id={id} />
          <DownloadButton selector=".RecordDetails" />
        </div>
      )}
    </div>
  )
}

export default RecordDetails
