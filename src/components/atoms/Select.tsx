import { FunctionComponent, useEffect, useRef, useState } from 'react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectChangeEvent {
  target: {
    value: string
    name?: string
  }
}

interface SelectProps {
  label: string
  options: SelectOption[]
  value?: string
  onChange?: (_e: SelectChangeEvent) => void
  className?: string
  id?: string
  name?: string
  disabled?: boolean
}

const Select: FunctionComponent<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  className = '',
  id,
  name,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectId = id ?? `select-${label.replace(/\s+/g, '-').toLowerCase()}`

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value),
  )

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (optionValue: string) => {
    setIsOpen(false)
    onChange?.({
      target: {
        value: optionValue,
        name,
      },
    })
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white p-1 pl-2 pr-3 text-sm text-gray-800 hover:bg-gray-100 focus:border-gray-800 focus:outline-none ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        <span className="truncate text-left font-medium">
          {selectedOption ? selectedOption.label : label}
        </span>
        <svg
          aria-hidden="true"
          className={`ml-2 h-4 w-4 shrink-0 text-gray-800 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={selectId}
          className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white p-1 shadow-md"
        >
          {options.map((option) => {
            const isSelected = String(option.value) === String(value)
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
                  isSelected
                    ? 'bg-gray-800 font-medium text-white'
                    : 'text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Select
