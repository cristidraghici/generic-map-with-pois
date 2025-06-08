import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react'
import { CustomMarker } from '../../types'
import { linkifyText } from '@/utils/linkifyText'
import ImageGallery from './ImageGallery'

type POIDetailsProps = PropsWithChildren<
  ComponentProps<'div'> &
    CustomMarker & {
      maxLines?: number
      showImages?: boolean
      showTitle?: boolean
    }
>

const POIDetails: FunctionComponent<POIDetailsProps> = ({
  title,
  description,
  images = [],
  className = '',
  maxLines = 0,
  showImages = true,
}): JSX.Element => {
  return (
    <div className={`overflow-hidden ${className}`}>
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
    </div>
  )
}

export default POIDetails
