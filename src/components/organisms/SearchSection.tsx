import { FunctionComponent, useMemo } from 'react'
import { AVAILABLE_DATASETS, WORLD_CITIES_MOCK_DATA_PATH } from '@/constants'
import { DatasetOption } from '@/hooks/useFetchData'
import { FilterDefinition } from '@/types'
import { ActiveFilters, FilterValue } from '@/utils/filterRecords'
import ConditionalElement from '../atoms/ConditionalElement'
import SearchField from '../atoms/SearchField'
import Select from '../atoms/Select'
import FilterAccordion from '../molecules/FilterAccordion'

interface SearchSectionProps {
  loading: boolean
  error: string | null
  hasUrl: boolean
  datasets: DatasetOption[]
  selectedDatasetIndex: number
  filters?: FilterDefinition[]
  activeFilters?: ActiveFilters
  onSearchChange: (_value: string) => void
  onDatasetChange: (_index: number) => void
  onFilterChange?: (_filterId: string, _value: FilterValue) => void
  onClearFilters?: () => void
}

const SearchSection: FunctionComponent<SearchSectionProps> = ({
  loading,
  error,
  hasUrl,
  datasets,
  selectedDatasetIndex,
  filters = [],
  activeFilters = {},
  onSearchChange,
  onDatasetChange,
  onFilterChange,
  onClearFilters,
}) => {
  const datasetSelectOptions = useMemo(
    () =>
      datasets.map((dataset, index) => ({
        value: index.toString(),
        label: dataset.label,
      })),
    [datasets],
  )

  return (
    <search className="absolute right-3 top-3 z-[998] flex w-96 max-w-[calc(100%-4.5rem)] flex-col gap-2">
      <SearchField onInputChange={onSearchChange} />

      {datasets.length > 1 && (
        <Select
          label="Select dataset"
          name="dataset"
          options={datasetSelectOptions}
          value={selectedDatasetIndex.toString()}
          onChange={(e) => onDatasetChange(Number(e.target.value))}
        />
      )}

      {filters.length > 0 && onFilterChange && onClearFilters && (
        <FilterAccordion
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
        />
      )}

      <ConditionalElement
        as="div"
        rcIf={!hasUrl}
        className="rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white p-3 text-xs text-gray-700 shadow-md"
      >
        It appears you have not specified an <strong>?api=</strong> param. You
        can use the default meanwhile:
        <div className="pt-3">
          <ul className="space-y-1">
            {AVAILABLE_DATASETS.map((dataset) => (
              <li key={dataset.value}>
                <a
                  className="text-blue-600 underline transition-colors hover:text-blue-800"
                  href={`?api=${dataset.value}`}
                  onClick={
                    dataset.value === WORLD_CITIES_MOCK_DATA_PATH
                      ? (e) => {
                          if (
                            !window.confirm(
                              'Are you sure you want to load the world cities points? This can take a while.',
                            )
                          ) {
                            e.preventDefault()
                          }
                        }
                      : undefined
                  }
                >
                  {dataset.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </ConditionalElement>

      <ConditionalElement
        as="div"
        rcIf={loading}
        role="status"
        className="rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white p-3 text-xs font-medium text-gray-700 shadow-md"
      >
        The data for the map is loading...
      </ConditionalElement>

      <ConditionalElement
        as="div"
        rcIf={!loading && !!error}
        role="alert"
        className="rounded-md border border-red-300 bg-red-50 p-3 text-xs font-medium text-red-800 shadow-md"
      >
        {error}
      </ConditionalElement>
    </search>
  )
}

export default SearchSection
