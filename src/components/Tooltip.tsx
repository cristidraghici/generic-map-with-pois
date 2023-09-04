import { FunctionComponent, HTMLProps, PropsWithChildren } from "react";

interface TooltipProps extends HTMLProps<HTMLButtonElement> {
  text: string | string[];
}

const Tooltip: FunctionComponent<PropsWithChildren<TooltipProps>> = ({
  className,
  children,
  text,
}) => {
  return (
    <div className="relative inline-block group duration-300">
      {children}
      <div
        className={`tooltip hidden group-hover:block absolute -top-2 -right-3 translate-x-full bg-gray-800 text-white text-sm py-1 px-2 opacity-90 rounded-md cursor-pointer before:content-[''] before:absolute before:top-1/2  before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-gray-700 ${className}`}
      >
        {!Array.isArray(text)
          ? text
          : text.map((textItem, key) => (
              <div className="mb-2" key={key}>
                {textItem}
              </div>
            ))}
      </div>
    </div>
  );
};

export default Tooltip;
