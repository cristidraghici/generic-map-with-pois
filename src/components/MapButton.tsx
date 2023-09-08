import {
  FunctionComponent,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from 'react'

interface MapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const MapButton: FunctionComponent<PropsWithChildren<MapButtonProps>> = ({
  children,
  className,
  disabled,
  ...rest
}) => {
  return (
    <button
      className={`flex min-h-[30px]	min-w-[30px] cursor-pointer items-center justify-center border-b-[1px] border-gray-700 border-opacity-50 bg-white p-[2px] text-2xl leading-5 text-black hover:bg-gray-100 ${className} ${
        disabled ? 'opacity-50' : ''
      }`}
      {...rest}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default MapButton
