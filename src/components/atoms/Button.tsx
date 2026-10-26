import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react'

export interface ButtonProps extends ComponentProps<'button'> {
  icon?: JSX.Element
  variant?: 'default' | 'transparent' | 'primary' | 'dark'
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-white text-gray-800 hover:bg-gray-50',
  transparent: 'bg-transparent text-gray-800 hover:bg-gray-100',
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  dark: 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-800',
}

const Button: FunctionComponent<PropsWithChildren<ButtonProps>> = ({
  children,
  disabled,
  icon,
  className = '',
  variant = 'default',
  ...rest
}) => {
  return (
    <button
      className={`
        flex min-h-[32px] min-w-[32px] cursor-pointer items-center justify-center
        bg-clip-padding p-[2px] text-2xl leading-5 transition-colors
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
      {...rest}
      disabled={disabled}
    >
      {icon}
      {children && <span className="mx-2 text-xs font-medium">{children}</span>}
    </button>
  )
}

export default Button
