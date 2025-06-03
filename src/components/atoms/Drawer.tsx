import { FunctionComponent, PropsWithChildren } from 'react'
import { ReactComponent as IconCloseSVG } from '@/assets/icons/close.svg'
import Button from './Button'
import Backdrop from './Backdrop'

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
  return (
    <>
      <Backdrop onClose={onClose} isOpen={isOpen} />

      <div
        className={`fixed inset-y-0 z-[999] w-96 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          side === 'right' ? 'right-0' : 'left-0'
        } ${
          isOpen
            ? 'translate-x-0'
            : side === 'right'
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
      >
        <Button
          variant="transparent"
          className="absolute right-4 top-4"
          onClick={onClose}
          icon={
            <IconCloseSVG className="h-6 w-6 text-gray-600 transition duration-300 ease-in-out" />
          }
        />
        <div className="h-full overflow-y-auto p-4">{children}</div>
      </div>
    </>
  )
}

export default Drawer
