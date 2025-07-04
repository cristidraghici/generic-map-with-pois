import { ReactNode, useEffect, useRef, useState } from 'react'
import ButtonGroup from '../molecules/ButtonGroup'
import ButtonWithTooltip from '../molecules/ButtonWithTooltip'
import { ReactComponent as IconListSVG } from '@/assets/icons/cards.svg'

interface HorizontalViewportSplitProps {
  mainElement: ReactNode

  splitElement: ReactNode
  isSplitEnabled: boolean

  onClick?: (_isListOpen?: boolean) => void
  onResize?: () => void
}

const HorizontalViewportSplit = ({
  mainElement,
  splitElement,
  isSplitEnabled,
  onClick,
  onResize,
}: HorizontalViewportSplitProps) => {
  const [isListOpen, setIsListOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !isSplitEnabled) return

    const observer = new ResizeObserver(() => {
      !!onResize && onResize()
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [isListOpen, onResize, isSplitEnabled])

  if (!isSplitEnabled) {
    return <div style={{ height: '100vh' }}>{mainElement}</div>
  }

  return (
    <>
      <div
        ref={containerRef}
        style={{ height: isListOpen ? '50dvh' : '100dvh' }}
      >
        {mainElement}
      </div>

      <div className="relative w-full">
        <ButtonGroup className="absolute -top-[40px] left-[10px] z-[998]">
          <ButtonWithTooltip
            tooltip="Toggle the split view"
            variant="transparent"
            onClick={() => {
              setIsListOpen((prev) => {
                !!onClick && onClick(!prev)
                return !prev
              })
            }}
            icon={
              <IconListSVG width={15} height={15} className="fill-current" />
            }
          />
        </ButtonGroup>
        {isListOpen && <div style={{ height: '50dvh' }}>{splitElement}</div>}
      </div>
    </>
  )
}

export default HorizontalViewportSplit
