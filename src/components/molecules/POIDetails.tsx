import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react'
import { CustomMarker } from '../../types'
import { linkifyText } from '@/utils/linkifyText'

type POIDetailsProps = PropsWithChildren<ComponentProps<'div'> & CustomMarker>

const POIDetails: FunctionComponent<POIDetailsProps> = ({
  title,
  description,
  className,
}): JSX.Element => {
  return (
    <div className={`overflow-hidden p-1 ${className}`}>
      <h3 className="p-2 pl-0 font-bold">{title}</h3>

      {!!description &&
        (!Array.isArray(description) ? (
          <div className="p-2 pl-0">{description}</div>
        ) : (
          <ul className="mt-2 [&>*:last-child]:border-0">
            {description.map((descriptionItem, key) => (
              <li
                className="overflow-hidden truncate whitespace-nowrap border-b-2 border-gray-100 p-2 pl-0"
                key={key}
              >
                {linkifyText(descriptionItem)}
              </li>
            ))}
          </ul>
        ))}
    </div>
  )
}

export default POIDetails
