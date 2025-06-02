import { FunctionComponent } from 'react'
import { CustomMarker } from '../types'

const POIDetails: FunctionComponent<CustomMarker> = ({
  title,
  description,
}): JSX.Element => {
  return (
    <div className="p-1">
      <h3 className="p-2 pl-0 font-bold">{title}</h3>

      {!!description &&
        (!Array.isArray(description) ? (
          <div className="p-2 pl-0">{description}</div>
        ) : (
          <ul className="mt-2 [&>*:last-child]:border-0">
            {description.map((descriptionItem, key) => (
              <li className="border-b-2 border-gray-100 p-2 pl-0" key={key}>
                {descriptionItem}
              </li>
            ))}
          </ul>
        ))}
    </div>
  )
}
export default POIDetails
