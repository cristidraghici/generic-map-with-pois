import {
  ComponentProps,
  FunctionComponent,
  PropsWithChildren,
  useMemo,
} from 'react'
import { ReactComponent as IconCloseSVG } from '@/assets/icons/close.svg'
import useKeyPress from '@/hooks/useKeyPress'
import Backdrop from '../atoms/Backdrop'
import Button from '../atoms/Button'

interface DrawerProps extends ComponentProps<'div'> {
  isOpen: boolean
  onClose: () => void
  side?: 'left' | 'right'
}

const Drawer: FunctionComponent<PropsWithChildren<DrawerProps>> = ({
  isOpen,
  onClose,
  children,
  side = 'right',
  className = '',
  ...props
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
        className={`${className} fixed inset-y-0 z-[999] w-96 max-w-[calc(100%-0.5rem)] bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          side === 'right' ? 'right-0' : 'left-0'
        } ${
          isOpen
            ? 'translate-x-0'
            : side === 'right'
              ? 'translate-x-full'
              : '-translate-x-full'
        }`}
        {...props}
      >
        <Button
          variant="transparent"
          className="absolute right-4 top-4 z-10"
          onClick={onClose}
          icon={
            <IconCloseSVG className="h-5 w-5 text-gray-500 transition duration-200 ease-in-out hover:text-gray-800" />
          }
        />
        <div className="z-[999] h-full overflow-y-auto p-4 pr-12">
          {children}
        </div>
      </div>
    </>
  )
}

export default Drawer
