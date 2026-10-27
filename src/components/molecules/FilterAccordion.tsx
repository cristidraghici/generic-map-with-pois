import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { FilterDefinition } from '@/types'
import {
  ActiveFilters,
  areFiltersEqual,
  FilterValue,
  getActiveFilterCount,
  getCheckboxValues,
  getIncludeMissing,
  getRangeValue,
  getSelectValue,
  hasAnyFilterState,
} from '@/utils/filterRecords'
import PillButton from '../atoms/PillButton'
import NumericRangeFilter from './NumericRangeFilter'

interface FilterAccordionProps {
  filters: FilterDefinition[]
  activeFilters: ActiveFilters
  savedFilters?: ActiveFilters
  onFilterChange: (_filterId: string, _value: FilterValue) => void
  onClearFilters: () => void
  onSaveFilters?: () => void
  className?: string
}

const FilterAccordion: FunctionComponent<FilterAccordionProps> = ({
  filters,
  activeFilters,
  savedFilters = {},
  onFilterChange,
  onClearFilters,
  onSaveFilters,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [maxContentHeight, setMaxContentHeight] = useState<number | undefined>(
    undefined,
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const activeCount = getActiveFilterCount(filters, activeFilters)
  const savedCount = getActiveFilterCount(filters, savedFilters)
  const isSaved =
    activeCount > 0 && areFiltersEqual(filters, activeFilters, savedFilters)
  const canClear = hasAnyFilterState(filters, activeFilters) || savedCount > 0
  const canSave = activeCount > 0 && !isSaved

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
    const currentVal = activeFilters[filterId]
    const current = getCheckboxValues(currentVal)
    const includeMissing = getIncludeMissing(currentVal)
    const next = current.includes(optionValue)
      ? current.filter((val) => val !== optionValue)
      : [...current, optionValue]

    if (includeMissing) {
      onFilterChange(filterId, {
        ...(next.length > 0 ? { values: next } : {}),
        includeMissing: true,
      })
    } else {
      onFilterChange(filterId, next.length > 0 ? next : undefined)
    }
  }

  const handleSelectToggle = (filterId: string, optionValue: string) => {
    const currentVal = activeFilters[filterId]
    const current = getSelectValue(currentVal)
    const includeMissing = getIncludeMissing(currentVal)
    const next = current === optionValue ? '' : optionValue

    if (includeMissing) {
      onFilterChange(filterId, {
        ...(next ? { value: next } : {}),
        includeMissing: true,
      })
    } else {
      onFilterChange(filterId, next || undefined)
    }
  }

  const handleSelectAll = (filterId: string) => {
    const includeMissing = getIncludeMissing(activeFilters[filterId])
    onFilterChange(
      filterId,
      includeMissing ? { includeMissing: true } : undefined,
    )
  }

  const handleIncludeMissingToggle = (
    filter: FilterDefinition,
    nextIncludeMissing: boolean,
  ) => {
    const currentVal = activeFilters[filter.id]

    if (filter.type === 'checkbox') {
      const values = getCheckboxValues(currentVal)
      if (nextIncludeMissing) {
        onFilterChange(filter.id, {
          ...(values.length > 0 ? { values } : {}),
          includeMissing: true,
        })
      } else {
        onFilterChange(filter.id, values.length > 0 ? values : undefined)
      }
    } else if (filter.type === 'select') {
      const value = getSelectValue(currentVal)
      if (nextIncludeMissing) {
        onFilterChange(filter.id, {
          ...(value ? { value } : {}),
          includeMissing: true,
        })
      } else {
        onFilterChange(filter.id, value || undefined)
      }
    }
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
              const includeMissing = getIncludeMissing(filterVal)

              if (filter.type === 'checkbox') {
                const selectedValues = getCheckboxValues(filterVal)
                return (
                  <div key={filter.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-gray-800">
                      <span>{filter.label}</span>
                      <label
                        htmlFor={`${filter.id}-include-missing`}
                        className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-normal text-gray-600 select-none hover:text-gray-800"
                      >
                        <input
                          id={`${filter.id}-include-missing`}
                          type="checkbox"
                          checked={includeMissing}
                          onChange={(e) =>
                            handleIncludeMissingToggle(filter, e.target.checked)
                          }
                          className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-gray-800 accent-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-1"
                        />
                        <span>Include missing</span>
                      </label>
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
                const selectedValue = getSelectValue(filterVal)
                return (
                  <div key={filter.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-gray-800">
                      <span>{filter.label}</span>
                      <label
                        htmlFor={`${filter.id}-include-missing`}
                        className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-normal text-gray-600 select-none hover:text-gray-800"
                      >
                        <input
                          id={`${filter.id}-include-missing`}
                          type="checkbox"
                          checked={includeMissing}
                          onChange={(e) =>
                            handleIncludeMissingToggle(filter, e.target.checked)
                          }
                          className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-gray-800 accent-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-1"
                        />
                        <span>Include missing</span>
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <PillButton
                        label="All"
                        active={!selectedValue}
                        onClick={() => handleSelectAll(filter.id)}
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
                const rangeVal = getRangeValue(filterVal)
                return (
                  <NumericRangeFilter
                    key={filter.id}
                    id={filter.id}
                    label={filter.label}
                    unit={filter.unit}
                    minVal={rangeVal.min}
                    maxVal={rangeVal.max}
                    includeMissing={includeMissing}
                    onChange={(range) =>
                      onFilterChange(
                        filter.id,
                        Object.keys(range).length > 0 ? range : undefined,
                      )
                    }
                  />
                )
              }

              return null
            })}
          </div>

          <div className="shrink-0 border-t border-gray-200 bg-white p-2">
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!canClear}
                onClick={onClearFilters}
                className={`flex-1 rounded-md border border-gray-300 bg-clip-padding px-3 py-1.5 text-center text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-1 ${
                  canClear
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    : 'cursor-not-allowed text-gray-400 opacity-50'
                }`}
              >
                Clear filters
              </button>
              <button
                type="button"
                disabled={!canSave}
                onClick={onSaveFilters}
                className={`flex-1 rounded-md border bg-clip-padding px-3 py-1.5 text-center text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-1 ${
                  canSave
                    ? 'border-gray-800 bg-gray-800 text-white hover:bg-gray-700'
                    : 'cursor-not-allowed border-gray-300 text-gray-400 opacity-50'
                }`}
              >
                {isSaved ? 'Saved' : 'Save filters'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterAccordion
