import { FunctionComponent, ComponentProps, PropsWithChildren } from 'react'

export interface ButtonProps extends ComponentProps<'button'> {
  icon?: JSX.Element
  variant?: 'default' | 'transparent'
}

const Button: FunctionComponent<PropsWithChildren<ButtonProps>> = ({
  children,
  className,
  disabled,
  icon,
  variant = 'default',
  ...rest
}) => {
  return (
    <button
      className={`
        flex min-h-[30px] min-w-[30px] cursor-pointer items-center justify-center
        p-[2px] text-2xl leading-5
        ${variant === 'default' ? 'bg-white' : 'bg-transparent'}
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
      {...rest}
      disabled={disabled}
    >
      {icon}
      {children && <span className="ml-2 mr-2 text-sm">{children}</span>}
    </button>
  )
}

export default Button
