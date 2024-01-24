import { ComponentProps, FunctionComponent, useEffect, useRef } from 'react'
import { ReactComponent as IconSearchSVG } from '../assets/icons/search.svg'
import { ReactComponent as IconCloseSVG } from '../assets/icons/close.svg'

interface SearchInputProps extends ComponentProps<'input'> {
  onCancel?: () => void
}

const SearchInput: FunctionComponent<SearchInputProps> = ({
  className,
  onCancel,
  value,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const inputElement = inputRef.current

    if (!inputElement) {
      return
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCancel) {
        onCancel()
      }
    }

    // Add the event listener when the component mounts
    inputElement.addEventListener('keydown', handleEscapeKey)

    // Clean up the event listener when the component unmounts
    return () => {
      inputElement.removeEventListener('keydown', handleEscapeKey)
    }
  }, [onCancel])

  return (
    <div className={`relative ${className || ''}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        className="w-full rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white p-1 pl-8 pr-8 hover:bg-gray-100 focus:border-gray-800 focus:outline-none"
        {...rest}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-black">
        <IconSearchSVG className="fill-gray-800" width={20} />
      </div>
      {!!value && (
        <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2 text-black">
          <IconCloseSVG
            className="fill-gray-800"
            width={20}
            onClick={() => onCancel && onCancel()}
          />
        </div>
      )}
    </div>
  )
}

export default SearchInput
