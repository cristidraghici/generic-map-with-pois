import {
  ComponentProps,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'

export interface PlainTooltipProps {
  tooltip: string | string[]
  msDelay?: number
}

type PlainTooltipComponentProps = ComponentProps<'div'> & PlainTooltipProps

const PlainTooltip: FunctionComponent<
  PropsWithChildren<PlainTooltipComponentProps>
> = ({
  tooltip,
  className = '',
  msDelay = 1000, // default delay in ms
  children,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        setShowTooltip(true)
      }, msDelay)

      return () => clearTimeout(timer)
    } else {
      setShowTooltip(false)
    }
  }, [isHovered, msDelay])

  useEffect(() => {
    const updateMousePosition = (event: MouseEvent) => {
      lastMousePosition.current = { x: event.clientX, y: event.clientY }
    }

    window.addEventListener('mousemove', updateMousePosition)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  useEffect(() => {
    if (!showTooltip) return

    const observer = new MutationObserver(() => {
      if (!lastMousePosition.current) return
      const { x, y } = lastMousePosition.current
      const elementUnderMouse = document.elementFromPoint(x, y)
      const buttonElement = ref.current

      if (
        buttonElement &&
        elementUnderMouse &&
        !buttonElement.contains(elementUnderMouse)
      ) {
        setIsHovered(false)
        setShowTooltip(false)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'], // for overlays that change visibility or position
    })

    return () => {
      observer.disconnect()
    }
  }, [showTooltip])

  return (
    <div
      ref={ref}
      className="relative inline-block duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {showTooltip && (
        <div
          className={`tooltip absolute -right-3 top-0 translate-x-full cursor-pointer rounded-md bg-gray-800 px-2 py-1 text-sm text-white opacity-90 before:absolute before:right-[100%] before:top-1/2 before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-gray-800 before:content-[''] ${className}`}
          {...rest}
        >
          {!Array.isArray(tooltip)
            ? tooltip
            : tooltip.map((textItem, key) => (
                <div className="mb-2" key={key}>
                  {textItem}
                </div>
              ))}
        </div>
      )}
    </div>
  )
}

export default PlainTooltip
