import { FunctionComponent } from 'react'
import SearchField from '../atoms/SearchField'
import ConditionalElement from '../atoms/ConditionalElement'

interface SearchSectionProps {
  search: string
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
            <li>
              <a href="?api=/cities_in_romania.json">cities_in_romania.json</a>
            </li>
            <li>
              <a
                href="?api=/world_cities.json"
                onClick={(e) => {
                  if (
                    !window.confirm(
                      'Are you sure you want to load the world cities points? This can take a while.',
                    )
                  ) {
                    e.preventDefault()
                  }
                }}
              >
                world_cities.json
              </a>
            </li>
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
