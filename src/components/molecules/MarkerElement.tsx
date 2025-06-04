import { FunctionComponent, PropsWithChildren } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
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
  marker: { latitude, longitude, title },
  color = 'blue',
  onClick,
  children,
}) => {
  const showTitle = title && title.length <= 10
  const icon = !showTitle
    ? createSvgIcon('default', color)
    : L.divIcon({
        className: '',
        html: `<div class="w-[65px] h-[20px] bg-[${MARKER_COLORS.blue}] text-white flex items-center justify-center border-1 border-black">${title}</div>`,
        iconSize: [65, 20],
        iconAnchor: [32.5, 20],
        tooltipAnchor: [0, -20],
      })

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
      {children && (
        <Tooltip direction={showTitle ? 'top' : 'auto'}>{children}</Tooltip>
      )}
    </Marker>
  )
}

export default MarkerElement
