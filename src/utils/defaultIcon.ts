import L from "leaflet";

import MARKER_ICON_URL from "../assets/images/marker-icon.png";
import MARKER_ICON_RETINA_URL from "../assets/images/marker-icon-2x.png";
import MARKER_SHADOW_URL from "../assets/images/marker-shadow.png";

// Fix for github pages not showing the icon
const defaultIcon = L.icon({
  iconUrl: MARKER_ICON_URL,
  iconRetinaUrl: MARKER_ICON_RETINA_URL,
  shadowUrl: MARKER_SHADOW_URL,
  iconSize: [35, 46],
  iconAnchor: [17, 46],
});

export default defaultIcon;
