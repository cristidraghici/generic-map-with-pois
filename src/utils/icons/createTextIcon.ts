import L from 'leaflet'

function createTextIcon(title = '', color = '#3B82F6') {
  // Temporary DOM element to measure text width
  const tempDiv = document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.visibility = 'hidden'
  tempDiv.style.height = '20px'
  tempDiv.style.padding = '0 8px' // px-2 in Tailwind = 0.5rem = 8px
  tempDiv.style.font = '14px sans-serif' // match the text style used
  tempDiv.innerText = title

  document.body.appendChild(tempDiv)
  const textWidth = tempDiv.offsetWidth
  document.body.removeChild(tempDiv)

  const iconWidth = textWidth
  const iconHeight = 24

  const icon = L.divIcon({
    className: '',
    html: `
    <div class="relative group group-hover:z-[9999]">
      <div class="inline-flex h-[20px] px-2 text-white items-center justify-center bg-blue opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap" style="background-color: ${color};">
        ${title}
      </div>
      <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
                  border-l-4 border-l-transparent 
                  border-r-4 border-r-transparent 
                  border-t-[4px] opacity-90 group-hover:opacity-100 transition-opacity" 
           style="border-top-color: ${color};">
      </div>
    </div>
    `,
    iconSize: [iconWidth, iconHeight],
    iconAnchor: [iconWidth / 2, iconHeight],
    tooltipAnchor: [0, -iconHeight],
  })

  return icon
}
export default createTextIcon
