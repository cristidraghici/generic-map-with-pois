import { FunctionComponent, ComponentProps, PropsWithChildren } from 'react'

const MapButton: FunctionComponent<
  PropsWithChildren<ComponentProps<'button'> & { icon?: JSX.Element }>
> = ({ children, className, disabled, icon, ...rest }) => {
  return (
    <button
      className={`flex min-h-[30px]	min-w-[30px] cursor-pointer items-center justify-center border-b-[1px] border-gray-700 border-opacity-50 bg-white p-[2px] text-2xl leading-5 text-black hover:bg-gray-100 ${className} ${
        disabled ? 'opacity-50' : ''
      }`}
      {...rest}
      disabled={disabled}
    >
      {icon}
      {children && <span className="ml-2 mr-2 text-sm">{children}</span>}
    </button>
  )
}

export default MapButton
