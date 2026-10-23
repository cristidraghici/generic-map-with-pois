import { ComponentProps, FunctionComponent, useEffect, useRef } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<ComponentProps<'select'>, 'children'> {
  label: string
  options: SelectOption[]
  className?: string
}

const Select: FunctionComponent<SelectProps> = ({
  label,
  options,
  className = '',
  id,
  ...rest
}) => {
  const selectId = id ?? `select-${label.replace(/\s+/g, '-').toLowerCase()}`
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    const select = selectRef.current
    if (!select) return

    const selectedOption =
      (rest.value !== undefined
        ? options.find((opt) => opt.value === String(rest.value))
        : null) ?? options[select.selectedIndex]

    const selectedContent = select.querySelector('selectedcontent')

    if (selectedContent && selectedOption) {
      selectedContent.textContent = selectedOption.label
    }
  }, [options, rest.value])

  return (
    <div className={className}>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      <select
        ref={selectRef}
        id={selectId}
        className="custom-select w-full truncate rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white p-1
            pl-2 pr-8 text-gray-800 hover:bg-gray-100 focus:border-gray-800 focus:outline-none cursor-pointer"
        {...rest}
      >
        <button type="button">
          <selectedcontent />
        </button>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
