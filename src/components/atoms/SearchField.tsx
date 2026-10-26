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
  const [isFocused, setIsFocused] = useState(false)
  const onInputChangeRef = useRef(onInputChange)
  onInputChangeRef.current = onInputChange

  const debouncedInputChange = useMemo(
    () =>
      debounce(
        (nextValue: string) => onInputChangeRef.current?.(nextValue),
        100,
      ),
    [],
  )

  const handleSetValue = useCallback(
    (nextValue: string) => {
      debouncedInputChange(nextValue)
      setValue(nextValue)
    },
    [debouncedInputChange],
  )

  const keyActions = useMemo(
    () => [{ key: 'Escape', action: () => handleSetValue('') }],
    [handleSetValue],
  )

  useKeyPress(keyActions, isFocused)

  return (
    <div className={`relative ${className}`}>
      <input
        value={value}
        type="text"
        className="w-full rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white bg-clip-padding py-1.5 pl-8 pr-8 text-sm leading-5 hover:bg-gray-100 focus:border-gray-800 focus:outline-none"
        onChange={(e) => handleSetValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-500">
        <IconSearchSVG className="fill-gray-600" width={20} height={20} />
      </div>
      {value.length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2.5 text-gray-400 hover:text-gray-700 focus:outline-none"
          onClick={() => handleSetValue('')}
        >
          <IconCloseSVG
            className="fill-current transition-colors"
            width={20}
            height={20}
          />
        </button>
      )}
    </div>
  )
}

export default SearchField
