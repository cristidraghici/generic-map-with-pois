import { FunctionComponent, PropsWithChildren, useMemo } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import { CustomMarker, Config } from '@/types'
import createSvgIcon from '@/utils/createSvgIcon'
import createTextIcon from '@/utils/createTextIcon'

const MARKER_COLORS = {
  red: '#DC2626',
  blue: '#3B82F6',
  green: '#10B981',
}

interface MarkerElementProps {
  marker: CustomMarker
  color: (typeof MARKER_COLORS)[keyof typeof MARKER_COLORS]
  icon: Config['typeOfIcon']
  onClick?: () => void
}

const MarkerElement: FunctionComponent<
  PropsWithChildren<MarkerElementProps>
> = ({
  marker: { latitude, longitude, title },
  color = MARKER_COLORS.blue,
  icon = 'default',
  onClick,
  children,
}) => {
  const iconType = useMemo(() => {
    if (icon === 'text' && (!title || title.length === 0)) {
      return 'default'
    }

    return icon
  }, [icon, title])

  const validatedIcon =
    iconType === 'text'
      ? createTextIcon(title, color)
      : createSvgIcon(iconType, color)

  return (
    <Marker
      position={[latitude, longitude]}
      eventHandlers={{
        click: () => {
          onClick && onClick()
        },
      }}
      icon={validatedIcon}
    >
      {children && (
        <Tooltip direction={iconType === 'text' ? 'top' : 'auto'}>
          {children}
        </Tooltip>
      )}
    </Marker>
  )
}

export default MarkerElement
