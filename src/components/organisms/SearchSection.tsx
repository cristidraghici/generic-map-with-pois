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
    <div className="absolute right-0 top-0 z-[998]  w-96 max-w-full p-2 pl-[50px]">
      <SearchField className="mb-2" onInputChange={onSearchChange} />

      {datasets.length > 1 && (
        <Select
          className="mb-2"
          label="Select dataset"
          name="dataset"
          options={datasetSelectOptions}
          value={selectedDatasetIndex.toString()}
          onChange={(e) => onDatasetChange(Number(e.target.value))}
        />
      )}

      {filters.length > 0 && onFilterChange && onClearFilters && (
        <FilterAccordion
          className="mb-2"
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
        />
      )}

      <ConditionalElement
        as="div"
        rcIf={!hasUrl}
        className="rounded-md bg-white p-2 text-gray-800"
      >
        It appears you have not specified an <strong>?api=</strong> param. You
        can use the default meanwhile:
        <div className="pt-4">
          <ul>
            {AVAILABLE_DATASETS.map((dataset) => (
              <li key={dataset.value}>
                <a
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
        className="rounded-md bg-white p-2 text-gray-800"
      >
        The data for the map is loading...
      </ConditionalElement>

      <ConditionalElement
        as="div"
        rcIf={!loading && !!error}
        className="rounded-md border-red-500 bg-white p-2 text-red-800"
      >
        {error}
      </ConditionalElement>
    </div>
  )
}

export default SearchSection
