import SearchInput from './SearchInput'
import ConditionalElement from './ConditionalElement'

interface SearchSectionProps {
  search: string
  loading: boolean
  error: string | null
  api?: string
  onSearchChange: (_value: string) => void
  onSearchCancel: () => void
}

const SearchSection = ({
  search,
  loading,
  error,
  api,
  onSearchChange,
  onSearchCancel,
}: SearchSectionProps) => {
  return (
    <>
      <SearchInput
        className="mb-2"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
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
    </>
  )
}

export default SearchSection
