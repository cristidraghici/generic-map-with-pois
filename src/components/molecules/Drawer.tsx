import { FunctionComponent, PropsWithChildren, useMemo } from 'react'
import { ReactComponent as IconCloseSVG } from '@/assets/icons/close.svg'
import Button from '../atoms/Button'
import Backdrop from '../atoms/Backdrop'
import useKeyPress from '@/hooks/useKeyPress'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  side?: 'left' | 'right'
}

const Drawer: FunctionComponent<PropsWithChildren<DrawerProps>> = ({
  isOpen,
  onClose,
  children,
  side = 'right',
}) => {
  const keyActions = useMemo(
    () => [{ key: 'Escape', action: onClose }],
    [onClose],
  )

  useKeyPress(keyActions, isOpen)

  return (
    <>
      <Backdrop onClick={onClose} isOpen={isOpen} />

      <div
        className={`fixed inset-y-0 z-[999] w-96 max-w-[calc(100%-0.5rem)] bg-white p-1 shadow-xl transition-transform duration-300 ease-in-out ${
          side === 'right' ? 'right-0' : 'left-0'
        } ${
          isOpen
            ? 'translate-x-0'
            : side === 'right'
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
        style={{ maxWidth: 'calc(100% - 0.5rem)' }}
      >
        <Button
          variant="transparent"
          className="absolute right-4 top-4"
          onClick={onClose}
          icon={
            <IconCloseSVG className="h-6 w-6 text-gray-600 transition duration-300 ease-in-out" />
          }
        />
        <div className="z-[999] h-full overflow-y-auto p-3">{children}</div>
      </div>
    </>
  )
}

export default Drawer
