import L, { IconOptions } from 'leaflet'

import DefaultSVG from '@/assets/default.svg?raw'
import DotSVG from '@/assets/dot.svg?raw'

const ICONS = [
  {
    name: 'default',
    icon: DefaultSVG,
    config: {
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
    } as IconOptions,
  },
  {
    name: 'dot',
    icon: DotSVG,
    config: {
      iconSize: [10, 10],
      popupAnchor: [0, 0],
    } as IconOptions,
  },
]

const createSvgIcon = (
  icon: string = 'default',
  color: string = '#3B82F6',
): L.DivIcon => {
  const selectedIcon = ICONS.find((item) => item.name === icon)

  if (!selectedIcon) {
    throw new Error(`Icon "${icon}" not found.`)
  }

  const svgHtml = selectedIcon.icon.replace(/fill=".*?"/g, `fill="${color}"`)

  const svgIcon = L.divIcon({
    html: svgHtml,
    className: 'custom-svg-marker',
    ...selectedIcon.config,
  })

  return svgIcon
}

export default createSvgIcon
