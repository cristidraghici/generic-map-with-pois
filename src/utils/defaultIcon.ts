import L from 'leaflet'

import MARKER_ICON_URL from '../assets/marker/icon.png'
import MARKER_ICON_RETINA_URL from '../assets/marker/icon-2x.png'
import MARKER_SHADOW_URL from '../assets/marker/shadow.png'

// Fix for github pages not showing the icon
const defaultIcon = L.icon({
  iconUrl: MARKER_ICON_URL,
  iconRetinaUrl: MARKER_ICON_RETINA_URL,
  shadowUrl: MARKER_SHADOW_URL,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
})

export default defaultIcon
