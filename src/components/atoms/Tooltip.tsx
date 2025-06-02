import { FunctionComponent, ComponentProps, PropsWithChildren } from 'react'

interface TooltipProps extends ComponentProps<'button'> {
  tooltip: string | string[]
  position?: 'right' | 'left' | 'top' | 'bottom'
}

const Tooltip: FunctionComponent<PropsWithChildren<TooltipProps>> = ({
  className,
  children,
  tooltip,
  position = 'right',
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'right':
        return '-right-3 -top-2 translate-x-full before:right-[100%] before:border-r-gray-800'
      case 'left':
        return '-left-3 -top-2 -translate-x-full before:left-[100%] before:border-l-gray-800'
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2 before:left-1/2 before:top-full before:border-t-gray-800'
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 translate-y-2 before:left-1/2 before:bottom-full before:border-b-gray-800'
    }
  }

  return (
    <div className="group relative inline-block duration-300">
      {children}
      <div
        className={`tooltip absolute hidden cursor-pointer rounded-md bg-gray-800 px-2 py-1
          text-sm text-white opacity-90 before:absolute before:-translate-y-1/2
          before:border-8 before:border-y-transparent before:border-l-transparent
          before:content-[''] group-hover:block ${getPositionClasses()} ${className}`}
      >
        {!Array.isArray(tooltip)
          ? tooltip
          : tooltip.map((textItem, key) => (
              <div className="mb-2" key={key}>
                {textItem}
              </div>
            ))}
      </div>
    </div>
  )
}

export default Tooltip
