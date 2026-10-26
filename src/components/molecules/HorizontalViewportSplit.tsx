import { ReactNode, useEffect, useRef, useState } from 'react'
import { ReactComponent as IconListSVG } from '@/assets/icons/cards.svg'
import ButtonGroup from './ButtonGroup'
import ButtonWithTooltip from './ButtonWithTooltip'

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
      onResize?.()
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [onResize, isSplitEnabled])

  if (!isSplitEnabled) {
    return <div className="h-dvh">{mainElement}</div>
  }

  return (
    <>
      <div ref={containerRef} className={isListOpen ? 'h-[50dvh]' : 'h-dvh'}>
        {mainElement}
      </div>

      <div className="relative w-full">
        <ButtonGroup className="absolute -top-10 left-3 z-[998]">
          <ButtonWithTooltip
            tooltip="Toggle the split view"
            variant="transparent"
            onClick={() => {
              setIsListOpen((prev) => {
                onClick?.(!prev)
                return !prev
              })
            }}
            icon={
              <IconListSVG width={15} height={15} className="fill-current" />
            }
          />
        </ButtonGroup>
        {isListOpen && <div className="h-[50dvh]">{splitElement}</div>}
      </div>
    </>
  )
}

export default HorizontalViewportSplit
