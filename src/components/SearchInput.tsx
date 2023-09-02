import { InputHTMLAttributes, FunctionComponent } from "react";
import { ReactComponent as IconSearchSVG } from "../assets/icon-search.svg";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  // You can add additional custom props here
}

const SearchInput: FunctionComponent<SearchInputProps> = ({
  className,
  ...rest
}) => {
  return (
    <div className={`relative ${className || ""}`}>
      <input
        type="text"
        className="w-full p-1 pl-8 border-[2px] bg-white hover:bg-gray-50 border-gray-400 rounded-md focus:outline-none focus:border-gray-800"
        {...rest}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-black ">
        <IconSearchSVG className="fill-gray-800" width={20} />
      </div>
    </div>
  );
};

export default SearchInput;
