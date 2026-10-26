import L from 'leaflet'

let measureCanvas: HTMLCanvasElement | null = null

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char)

const SAFE_COLOR_REGEX =
  /^(#[0-9a-fA-F]{3,8}|(?:rgb|hsl)a?\([\d\s.,%/]+\)|[a-zA-Z]{1,32})$/

export const sanitizeCssColor = (
  color: string,
  fallback = '#3B82F6',
): string => {
  const trimmed = color.trim()
  return SAFE_COLOR_REGEX.test(trimmed) ? trimmed : fallback
}

function measureTextWidth(text: string, font: string): number {
  if (typeof document === 'undefined') {
    return text.length * 8
  }
  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas')
  }
  const context = measureCanvas.getContext('2d')
  if (!context) {
    return text.length * 8
  }
  context.font = font
  return Math.ceil(context.measureText(text).width)
}

function createTextIcon(title = '', color = '#3B82F6') {
  const safeTitle = escapeHtml(title)
  const safeColor = sanitizeCssColor(color)
  // px-2 in Tailwind = 0.5rem * 2 = 16px horizontal padding
  const iconWidth = measureTextWidth(title, '14px sans-serif') + 16
  const iconHeight = 24

  const icon = L.divIcon({
    className: '',
    html: `
    <div class="relative group group-hover:z-[9999]">
      <div class="inline-flex h-[20px] px-2 text-white items-center justify-center bg-blue opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap" style="background-color: ${safeColor};">
        ${safeTitle}
      </div>
      <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
                  border-l-4 border-l-transparent 
                  border-r-4 border-r-transparent 
                  border-t-[4px] opacity-90 group-hover:opacity-100 transition-opacity" 
           style="border-top-color: ${safeColor};">
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
