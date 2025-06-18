import { FunctionComponent, PropsWithChildren, memo, useMemo } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import { CustomRecord, Config } from '@/types'
import createSvgIcon from '@/utils/icons/createSvgIcon'
import createTextIcon from '@/utils/icons/createTextIcon'
import { iconCacheManager } from '@/utils/icons/cache'
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
      position={[latitude, longitude]}
      eventHandlers={{
        click: () => {
          onClick && onClick()
        },
      }}
      icon={iconEl}
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
