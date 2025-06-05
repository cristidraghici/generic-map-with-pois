import L from 'leaflet'

function createTextIcon(title = '', color = '#3B82F6') {
  return L.divIcon({
    className: '',
    html: `
      <div class="relative">
        <div class="w-[65px] h-[20px] bg-[${color}] text-white flex items-center justify-center">
          ${title}
        </div>
        <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
                    border-l-4 border-l-transparent 
                    border-r-4 border-r-transparent 
                    border-t-[4px]" 
             style="border-top-color: ${color};">
        </div>
      </div>
    `,
    iconSize: [65, 26], // 20px box + 6px triangle
    iconAnchor: [32.5, 26], // anchor at the triangle tip
    tooltipAnchor: [0, -26],
  })
}

export default createTextIcon
