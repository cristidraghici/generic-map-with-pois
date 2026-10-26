import { FunctionComponent, memo, PropsWithChildren, useMemo } from 'react'
import { Marker, MarkerProps, Tooltip } from 'react-leaflet'
import { MARKER_COLORS } from '@/constants'
import { Config, CustomRecord } from '@/types'
import { iconCacheManager } from '@/utils/icons/cache'
import createSvgIcon from '@/utils/icons/createSvgIcon'
import createTextIcon from '@/utils/icons/createTextIcon'
import RecordDetails from './RecordDetails'

interface MarkerElementProps extends Omit<MarkerProps, 'icon' | 'position'> {
  record: Partial<CustomRecord> & {
    latitude: number
    longitude: number
    title?: string
  }
  color?: (typeof MARKER_COLORS)[keyof typeof MARKER_COLORS] | string
  icon: Config['typeOfIcon']
  showTooltip?: boolean
  onSelect?: (_record: CustomRecord) => void
  onClick?: () => void
}

const MarkerElement: FunctionComponent<
  PropsWithChildren<MarkerElementProps>
> = ({
  record,
  color = MARKER_COLORS.blue,
  icon = 'default',
  showTooltip = false,
  onSelect,
  onClick,
  children,
  ...rest
}) => {
  const { latitude, longitude, title } = record

  const iconEl = useMemo(() => {
    const cacheId = `${icon}-${color}-${title ?? ''}`
    const cachedIcon = iconCacheManager.get(cacheId)
    if (cachedIcon) {
      return cachedIcon
    }

    const el =
      icon === 'text'
        ? createTextIcon(title, color)
        : createSvgIcon(icon, color)
    iconCacheManager.set(cacheId, el)
    return el
  }, [icon, color, title])

  const position = useMemo<[number, number]>(
    () => [latitude, longitude],
    [latitude, longitude],
  )

  const eventHandlers = useMemo(
    () => ({
      click: () => {
        onClick?.()
        onSelect?.(record as CustomRecord)
      },
    }),
    [onClick, onSelect, record],
  )

  return (
    <Marker
      eventHandlers={eventHandlers}
      icon={iconEl}
      position={position}
      {...rest}
    >
      {(showTooltip || children) && (
        <Tooltip direction={icon === 'text' ? 'top' : 'auto'}>
          {children ?? (
            <RecordDetails
              className="max-w-[300px]"
              {...(record as CustomRecord)}
              maxLines={5}
              showImages={false}
              showMinimap={false}
              showActions={false}
            />
          )}
        </Tooltip>
      )}
    </Marker>
  )
}

const MemoizedMarkerElement = memo(MarkerElement)

export default MemoizedMarkerElement
