import L from 'leaflet'

import IconSVG from '@/assets/icon.svg?raw'

function createSvgIcon(color = '#3B82F6') {
  const svgWithColor = IconSVG.replace(/fill=".*?"/g, `fill="${color}"`)

  const svgIcon = L.divIcon({
    html: svgWithColor,
    className: 'custom-svg-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  })

  return svgIcon
}

export default createSvgIcon
