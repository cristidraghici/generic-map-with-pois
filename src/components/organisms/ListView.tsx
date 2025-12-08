import { PropsWithChildren, useState } from 'react'
import Button from '@/components/atoms/Button'
import RecordDetails from '@/components/molecules/RecordDetails'
import { CustomRecord } from '@/types'

interface ListViewProps extends PropsWithChildren {
  records: CustomRecord[]
  onRecordSelect: (_record: CustomRecord) => void
}

const ITEMS_PER_PAGE = 10 // Number of items to show per page

const ListView = ({ records = [], onRecordSelect }: ListViewProps) => {
  const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_PER_PAGE)

  return (
    <div className="flex h-[50vh] flex-col bg-gray-100">
      <div className="overflow-auto bg-gray-100 p-4">
        <ul className="grid flex-grow grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {records.slice(0, visibleItemsCount).map((record) => (
            <li key={record.id} className="flex">
              <button
                type="button"
                className="flex h-full w-full max-w-[300px] flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-md transition-all duration-200 hover:bg-gray-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => onRecordSelect(record)}
              >
                <RecordDetails
                  {...record}
                  maxLines={5}
                  showImages={false}
                  showMinimap={false}
                  showActions={false}
                />
              </button>
            </li>
          ))}
        </ul>

        {visibleItemsCount < records.length && (
          <div className="flex justify-center p-4 text-center">
            <Button
              variant="default"
              className="relative rounded-md bg-gray-500 px-4 py-2 text-black hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={() =>
                setVisibleItemsCount((prev) =>
                  Math.min(prev + ITEMS_PER_PAGE, records.length),
                )
              }
            >
              Show more ({records.length - visibleItemsCount} remaining)
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListView
