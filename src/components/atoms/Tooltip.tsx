import { FunctionComponent, ComponentProps, PropsWithChildren } from 'react'

interface TooltipProps extends ComponentProps<'button'> {
  tooltip: string | string[]
}

const Tooltip: FunctionComponent<PropsWithChildren<TooltipProps>> = ({
  className,
  children,
  tooltip,
}) => {
  return (
    <div className="group relative inline-block duration-300">
      {children}
      <div
        className={`tooltip absolute -right-3 -top-2 hidden translate-x-full cursor-pointer rounded-md bg-gray-800 px-2 py-1 text-sm text-white opacity-90 before:absolute before:right-[100%] before:top-1/2 before:-translate-y-1/2  before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-gray-800 before:content-[''] group-hover:block ${className}`}
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
