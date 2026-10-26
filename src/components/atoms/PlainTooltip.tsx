import {
  ComponentProps,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useId,
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
  const [isActive, setIsActive] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipId = useId()

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setShowTooltip(true)
      }, msDelay)

      return () => clearTimeout(timer)
    }
    setShowTooltip(false)
  }, [isActive, msDelay])

  const dismiss = () => {
    setIsActive(false)
    setShowTooltip(false)
  }

  return (
    <div
      className="relative inline-block duration-300"
      onPointerEnter={() => setIsActive(true)}
      onPointerLeave={dismiss}
      onFocus={() => setIsActive(true)}
      onBlur={dismiss}
      onClick={dismiss}
      aria-describedby={showTooltip ? tooltipId : undefined}
    >
      {children}
      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`tooltip pointer-events-none absolute -right-3 top-0 translate-x-full rounded-md bg-gray-800 px-2.5 py-1 text-xs font-medium text-white shadow-md before:absolute before:right-[100%] before:top-1/2 before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-gray-800 before:content-[''] ${className}`}
          {...rest}
        >
          {!Array.isArray(tooltip)
            ? tooltip
            : tooltip.map((textItem) => (
                <div className="mb-2" key={textItem}>
                  {textItem}
                </div>
              ))}
        </div>
      )}
    </div>
  )
}

export default PlainTooltip
