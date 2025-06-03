import { FunctionComponent, PropsWithChildren } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import { CustomMarker } from '@/types'
import createSvgIcon from '@/utils/createSvgIcon'

const MARKER_COLORS = {
  red: '#DC2626',
  blue: '#3B82F6',
  green: '#10B981',
}

interface MarkerElementProps {
  marker: CustomMarker
  color: (typeof MARKER_COLORS)[keyof typeof MARKER_COLORS]
  onClick?: () => void
}

const MarkerElement: FunctionComponent<
  PropsWithChildren<MarkerElementProps>
> = ({
  marker: { latitude, longitude },
  color = 'blue',
  onClick,
  children,
}) => {
  const icon = createSvgIcon(color)

  return (
    <Marker
      position={[latitude, longitude]}
      eventHandlers={{
        click: () => {
          onClick && onClick()
        },
      }}
      icon={icon}
    >
      {children && <Tooltip direction="auto">{children}</Tooltip>}
    </Marker>
  )
}

export default MarkerElement
