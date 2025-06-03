import L from 'leaflet'

function createSvgIcon(color = '#3B82F6') {
  const svgTemplate = `
    <svg width="25" height="41" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="${color}"
        d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"
      />
    </svg>
  `

  const svgIcon = L.divIcon({
    html: svgTemplate,
    className: 'custom-svg-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  })

  return svgIcon
}

export default createSvgIcon
