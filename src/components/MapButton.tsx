import {
  FunctionComponent,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from "react";

interface MapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const MapButton: FunctionComponent<PropsWithChildren<MapButtonProps>> = ({
  children,
  className,
  disabled,
  ...rest
}) => {
  return (
    <button
      className={`flex items-center	justify-center min-w-[30px] min-h-[30px] p-[2px] text-2xl leading-5 text-black bg-white hover:bg-gray-100 border-b-[1px] border-gray-700 border-opacity-50 cursor-pointer ${className} ${
        disabled ? "opacity-50" : ""
      }`}
      {...rest}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default MapButton;
