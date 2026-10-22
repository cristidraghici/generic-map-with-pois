import { FunctionComponent } from 'react'
import { AVAILABLE_DATASETS, WORLD_CITIES_MOCK_DATA_PATH } from '@/constants'
import ConditionalElement from '../atoms/ConditionalElement'
import SearchField from '../atoms/SearchField'

interface SearchSectionProps {
  loading: boolean
  error: string | null
  hasUrl: boolean
  onSearchChange: (_value: string) => void
}

const SearchSection: FunctionComponent<SearchSectionProps> = ({
  loading,
  error,
  hasUrl,
  onSearchChange,
}) => {
  return (
    <div className="absolute right-0 top-0 z-[998]  w-96 max-w-full p-2 pl-[50px]">
      <SearchField className="mb-2" onInputChange={onSearchChange} />

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
