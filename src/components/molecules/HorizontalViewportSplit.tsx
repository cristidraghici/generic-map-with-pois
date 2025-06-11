import { ReactNode, useEffect, useRef, useState } from 'react'
import ButtonGroup from '../molecules/ButtonGroup'
import ButtonWithTooltip from '../molecules/ButtonWithTooltip'
import { ReactComponent as IconListSVG } from '@/assets/icons/list.svg'

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
      <div ref={containerRef} style={{ height: isListOpen ? '50vh' : '100vh' }}>
        {mainElement}
      </div>

      {isListOpen && <div style={{ height: '50vh' }}>{splitElement}</div>}

      <ButtonGroup className="absolute bottom-[30px] left-[10px] z-[998]">
        <ButtonWithTooltip
          tooltip="Toggle the split view"
          variant="transparent"
          onClick={() => {
            setIsListOpen((prev) => {
              !!onClick && onClick(!prev)

              return !prev
            })
          }}
          icon={<IconListSVG width={15} height={15} className="fill-current" />}
        />
      </ButtonGroup>
    </>
  )
}

export default HorizontalViewportSplit
