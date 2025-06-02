import { FunctionComponent, PropsWithChildren } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import { CustomMarker } from '@/types'

interface MarkerElementProps {
  marker: CustomMarker
  onClick?: () => void
}

const MarkerElement: FunctionComponent<
  PropsWithChildren<MarkerElementProps>
> = ({ marker: { latitude, longitude }, onClick, children }) => {
  return (
    <Marker
      position={[latitude, longitude]}
      eventHandlers={{
        dblclick: () => {
          onClick && onClick()
        },
      }}
    >
      {children && <Tooltip direction="auto">{children}</Tooltip>}
    </Marker>
  )
}

export default MarkerElement
