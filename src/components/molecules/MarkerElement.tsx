import { FunctionComponent, PropsWithChildren, useMemo } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import { CustomRecord, Config } from '@/types'
import createSvgIcon from '@/utils/createSvgIcon'
import createTextIcon from '@/utils/createTextIcon'
import { MARKER_COLORS } from '@/constants'

interface MarkerElementProps {
  record: CustomRecord
  color: (typeof MARKER_COLORS)[keyof typeof MARKER_COLORS]
  icon: Config['typeOfIcon']
  onClick?: () => void
}

const MarkerElement: FunctionComponent<
  PropsWithChildren<MarkerElementProps>
> = ({
  record: { latitude, longitude, title },
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
