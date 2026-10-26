import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react'

const ButtonGroup: FunctionComponent<
  PropsWithChildren<ComponentProps<'div'>>
> = ({ children, className = '' }) => {
  return (
    <div className={`z-[998] ${className}`}>
      <div className="flex flex-col rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white bg-clip-padding shadow-sm [&>*:first-child_button]:rounded-t-[4px] [&>*:first-child]:rounded-t-[4px] [&>*:last-child_button]:rounded-b-[4px] [&>*:last-child]:rounded-b-[4px] [&>*:not(:last-child)_button]:border-b [&>*:not(:last-child)_button]:border-gray-200 [&>*:only-child_button]:rounded-[4px] [&>*:only-child]:rounded-[4px] [&>button:first-child]:rounded-t-[4px] [&>button:last-child]:rounded-b-[4px] [&>button:not(:last-child)]:border-b [&>button:not(:last-child)]:border-gray-200 [&>button:only-child]:rounded-[4px]">
        {children}
      </div>
    </div>
  )
}

export default ButtonGroup
