import { FunctionComponent } from 'react'
import SearchField from '../molecules/SearchField'
import ConditionalElement from '../atoms/ConditionalElement'

interface SearchSectionProps {
  search: string
  loading: boolean
  error: string | null
  api?: string
  onSearchChange: (_value: string) => void
  onSearchCancel: () => void
}

const SearchSection: FunctionComponent<SearchSectionProps> = ({
  search,
  loading,
  error,
  api,
  onSearchChange,
  onSearchCancel,
}) => {
  return (
    <div className="absolute right-0 top-0 z-[998] w-[400px] max-w-full p-2 pl-[50px]">
      <SearchField
        className="mb-2"
        value={search}
        onChange={onSearchChange}
        onCancel={onSearchCancel}
      />

      <ConditionalElement
        as="div"
        rcIf={!api}
        className="rounded-md bg-white p-2 text-gray-800"
      >
        It appears you have not specified an <strong>?api=</strong> param. You
        can use the default meanwhile:
        <div className="pt-4">
          <a href="?api=/cities_in_romania.json">cities_in_romania.json</a>
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
