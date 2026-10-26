import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { FilterDefinition } from '@/types'
import {
  ActiveFilters,
  FilterValue,
  getActiveFilterCount,
} from '@/utils/filterRecords'
import PillButton from '../atoms/PillButton'
import NumericRangeFilter from './NumericRangeFilter'

interface FilterAccordionProps {
  filters: FilterDefinition[]
  activeFilters: ActiveFilters
  onFilterChange: (_filterId: string, _value: FilterValue) => void
  onClearFilters: () => void
  className?: string
}

const FilterAccordion: FunctionComponent<FilterAccordionProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [maxContentHeight, setMaxContentHeight] = useState<number | undefined>(
    undefined,
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const activeCount = getActiveFilterCount(filters, activeFilters)

  useEffect(() => {
    if (!isOpen) return

    const updateMaxHeight = () => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const remainingHeight = window.innerHeight - rect.bottom - 16
      setMaxContentHeight(Math.max(120, Math.floor(remainingHeight)))
    }

    updateMaxHeight()
    window.addEventListener('resize', updateMaxHeight)

    return () => {
      window.removeEventListener('resize', updateMaxHeight)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
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
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!filters || filters.length === 0) {
    return null
  }

  const handleCheckboxToggle = (filterId: string, optionValue: string) => {
    const current = (activeFilters[filterId] as string[]) || []
    const next = current.includes(optionValue)
      ? current.filter((val) => val !== optionValue)
      : [...current, optionValue]

    onFilterChange(filterId, next.length > 0 ? next : undefined)
  }

  const handleSelectToggle = (filterId: string, optionValue: string) => {
    const current = (activeFilters[filterId] as string) || ''
    const next = current === optionValue ? '' : optionValue
    onFilterChange(filterId, next || undefined)
  }

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white bg-clip-padding py-1.5 pl-3 pr-3 text-sm leading-5 text-gray-800 hover:bg-gray-100 focus:border-gray-800 focus:outline-none"
      >
        <div className="flex items-center">
          <span className="font-medium">Filters</span>
          {activeCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-gray-800 px-2 py-0.5 text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </div>
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
          style={{
            maxHeight:
              maxContentHeight !== undefined
                ? `${maxContentHeight}px`
                : undefined,
          }}
          className="mt-1 flex max-h-[calc(100dvh-11rem)] flex-col overflow-hidden rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white bg-clip-padding shadow-md"
        >
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {filters.map((filter) => {
              const filterVal = activeFilters[filter.id]

              if (filter.type === 'checkbox') {
                const selectedValues = Array.isArray(filterVal) ? filterVal : []
                return (
                  <div key={filter.id} className="space-y-1.5">
                    <div className="text-xs font-semibold text-gray-800">
                      {filter.label}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {filter.options?.map((option) => (
                        <PillButton
                          key={option.value}
                          label={option.label}
                          active={selectedValues.includes(option.value)}
                          onClick={() =>
                            handleCheckboxToggle(filter.id, option.value)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )
              }

              if (filter.type === 'select') {
                const selectedValue =
                  typeof filterVal === 'string' ? filterVal : ''
                return (
                  <div key={filter.id} className="space-y-1.5">
                    <div className="text-xs font-semibold text-gray-800">
                      {filter.label}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <PillButton
                        label="All"
                        active={!selectedValue}
                        onClick={() => onFilterChange(filter.id, undefined)}
                      />
                      {filter.options?.map((option) => (
                        <PillButton
                          key={option.value}
                          label={option.label}
                          active={selectedValue === option.value}
                          onClick={() =>
                            handleSelectToggle(filter.id, option.value)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )
              }

              if (filter.type === 'range') {
                const rangeVal =
                  typeof filterVal === 'object' && !Array.isArray(filterVal)
                    ? filterVal
                    : {}
                return (
                  <NumericRangeFilter
                    key={filter.id}
                    id={filter.id}
                    label={filter.label}
                    unit={filter.unit}
                    minVal={rangeVal?.min}
                    maxVal={rangeVal?.max}
                    onChange={(range) => onFilterChange(filter.id, range)}
                  />
                )
              }

              return null
            })}
          </div>

          <div className="shrink-0 border-t border-gray-200 bg-white p-2">
            <button
              type="button"
              disabled={activeCount === 0}
              onClick={onClearFilters}
              className={`w-full rounded-md border border-gray-300 px-3 py-1.5 text-center text-xs font-medium transition-colors ${
                activeCount > 0
                  ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  : 'cursor-not-allowed text-gray-400 opacity-50'
              }`}
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterAccordion
