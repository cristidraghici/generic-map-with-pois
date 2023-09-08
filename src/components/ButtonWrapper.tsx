import { FunctionComponent } from 'react'

const ButtonWrapper: FunctionComponent<{
  children?: JSX.Element | JSX.Element[]
  className?: string
}> = ({ children, className }) => {
  return (
    <div className={`z-[9999] ${className}`}>
      <div className="flex flex-col rounded-md border-[2px] border-gray-700 border-opacity-50 bg-white [&>*:first-child]:rounded-t-md [&>*:last-child]:rounded-b-md [&>*:last-child]:border-none">
        {children}
      </div>
    </div>
  )
}

export default ButtonWrapper
