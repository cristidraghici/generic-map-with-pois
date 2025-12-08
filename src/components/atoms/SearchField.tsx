import {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ReactComponent as IconCloseSVG } from '@/assets/icons/close.svg'
import { ReactComponent as IconSearchSVG } from '@/assets/icons/search.svg'
import useKeyPress from '@/hooks/useKeyPress'
import debounce from '@/utils/debounce'

interface SearchFieldProps extends ComponentProps<'input'> {
  onInputChange: (_value: string) => void
  className?: string
}

const SearchField: FunctionComponent<SearchFieldProps> = ({
  onInputChange,
  className = '',
  ...rest
}) => {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedInputChange = debounce(
    (value: string) => onInputChange?.(value),
    100,
  )

  const handleSetValue = useCallback(
    (value: string) => {
      debouncedInputChange(value)
      setValue(value)
    },
    [debouncedInputChange],
  )

  const keyActions = useMemo(
    () => [{ key: 'Escape', action: () => handleSetValue('') }],
    [handleSetValue],
  )

  useKeyPress(keyActions, inputRef.current === document.activeElement)

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        value={value}
        type="text"
        className="w-full rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white p-1
            pl-8 pr-8 hover:bg-gray-100 focus:border-gray-800 focus:outline-none"
        onChange={(e) => handleSetValue(e.target.value)}
        {...rest}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-black">
        <IconSearchSVG className="fill-gray-800" width={20} />
      </div>
      {value.length > 0 && (
        <div
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2 text-black"
          onClick={() => handleSetValue('')}
        >
          <IconCloseSVG className="fill-gray-800" width={20} />
        </div>
      )}
    </div>
  )
}

export default SearchField
