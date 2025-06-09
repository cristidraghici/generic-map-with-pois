import { PropsWithChildren, useEffect, useRef, useState } from 'react'
import ButtonGroup from '../molecules/ButtonGroup'
import ButtonWithTooltip from '../molecules/ButtonWithTooltip'
import { ReactComponent as IconListSVG } from '@/assets/icons/list.svg'
import { CustomMarker } from '@/types'
import POIDetails from '../molecules/POIDetails'
import Button from '../atoms/Button'

/**
 * TODO: Refactor the whole project to use a map provider and reduce props drilling
 */
interface ListViewProps extends PropsWithChildren {
  isListEnabled: boolean
  records: CustomMarker[]
  handlePOISelect: (_poi: CustomMarker) => void
  handleInvalidateSize: () => void
}

const ITEMS_PER_PAGE = 10 // Number of items to show per page

const ListView = ({
  isListEnabled,
  records = [],
  children,
  handlePOISelect,
  handleInvalidateSize,
}: ListViewProps) => {
  const [isListOpen, setIsListOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_PER_PAGE)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver(() => {
      handleInvalidateSize()
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [isListOpen, handleInvalidateSize])

  useEffect(() => {
    if (isListOpen) {
      setVisibleItemsCount(ITEMS_PER_PAGE)
    }
  }, [records, isListOpen])

  if (!isListEnabled) {
    return (
      <div ref={containerRef} style={{ height: '100vh' }}>
        {children}
      </div>
    )
  }

  return (
    <>
      <div ref={containerRef} style={{ height: isListOpen ? '50vh' : '100vh' }}>
        {children}
      </div>

      <ButtonGroup className="absolute bottom-[30px] left-[10px]">
        <ButtonWithTooltip
          tooltip="Show the data as a list"
          variant="transparent"
          onClick={() => setIsListOpen((prev) => !prev)}
          icon={<IconListSVG width={15} height={15} className="fill-current" />}
        />
      </ButtonGroup>

      {isListOpen && (
        <div className="flex h-[50vh] flex-col bg-gray-100 p-4">
          <ul className="grid flex-grow grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 overflow-auto bg-gray-100 p-4">
            {records.slice(0, visibleItemsCount).map((poi, index) => (
              <li key={index} className="flex">
                <button
                  type="button"
                  className="flex h-full w-full max-w-[300px] flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-md transition-all duration-200 hover:bg-gray-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  onClick={() => handlePOISelect(poi)}
                >
                  <POIDetails {...poi} maxLines={5} showImages={false} />
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
      )}
    </>
  )
}

export default ListView
