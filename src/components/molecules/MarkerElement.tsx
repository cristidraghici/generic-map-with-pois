import { FunctionComponent, memo, PropsWithChildren, useMemo } from 'react'
import { Marker, MarkerProps, Tooltip } from 'react-leaflet'
import { MARKER_COLORS } from '@/constants'
import { Config, CustomRecord } from '@/types'
import { iconCacheManager } from '@/utils/icons/cache'
import createSvgIcon from '@/utils/icons/createSvgIcon'
import createTextIcon from '@/utils/icons/createTextIcon'

interface MarkerElementProps extends Omit<MarkerProps, 'icon' | 'position'> {
  record: Partial<CustomRecord> & {
    latitude: number
    longitude: number
    title?: string
  }
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
  ...rest
}) => {
  const iconEl = useMemo(() => {
    const cacheId = `${icon}-${color}-${title}`

    if (icon === 'text') {
      const el = createTextIcon(title, color)
      iconCacheManager.set(cacheId, el)
      return el
    }

    const el = createSvgIcon(icon, color)
    iconCacheManager.set(cacheId, el)
    return el
  }, [icon, color, title])

  return (
    <Marker
      eventHandlers={{
        click: () => {
          onClick?.()
        },
      }}
      icon={iconEl}
      position={[latitude, longitude]}
      {...rest}
    >
      {children && (
        <Tooltip direction={icon === 'text' ? 'top' : 'auto'}>
          {children}
        </Tooltip>
      )}
    </Marker>
  )
}

const MemoizedMarkerElement = memo(MarkerElement)

export default MemoizedMarkerElement
