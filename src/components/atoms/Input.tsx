import { ComponentProps, forwardRef } from 'react'

interface InputProps extends ComponentProps<'input'> {
  leftIcon?: JSX.Element
  rightIcon?: JSX.Element
  onRightIconClick?: () => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, onRightIconClick, ...rest }, ref) => {
    return (
      <div className={`relative ${className || ''}`}>
        <input
          ref={ref}
          type="text"
          className="w-full rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white p-1
            pl-8 pr-8 hover:bg-gray-100 focus:border-gray-800 focus:outline-none"
          {...rest}
        />
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-black">
            {leftIcon}
          </div>
        )}
        {rightIcon && (
          <div
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2 text-black"
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
