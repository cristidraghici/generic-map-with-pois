import {
  ComponentProps,
  FunctionComponent,
  MouseEvent,
  PropsWithChildren,
} from 'react'
import { ReactComponent as IconCloseSVG } from '@/assets/icons/close.svg'
import Backdrop from './Backdrop'
import Button from './Button'

interface ModalProps extends ComponentProps<'div'> {
  isOpen: boolean
  onClose: () => void
}

const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  children,
  className = '',
  ...rest
}) => {
  const handleContainerClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <>
      <Backdrop onClick={onClose} isOpen={isOpen} />

      <div
        {...rest}
        className={`fixed inset-0 z-[999] m-2 flex items-center justify-center transition-opacity duration-300 ${className} ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={handleContainerClick}
      >
        <div className="relative z-[999] mx-auto w-full max-w-md rounded bg-white pl-2 pr-2 shadow-xl">
          <Button
            variant="transparent"
            className="absolute right-2 top-2"
            onClick={onClose}
            icon={
              <IconCloseSVG className="h-6 w-6 text-gray-600 transition duration-300 ease-in-out" />
            }
          />
          <div className="max-h-[80vh] overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </>
  )
}

export default Modal
