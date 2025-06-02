import { FunctionComponent, PropsWithChildren } from 'react'
import { ReactComponent as IconCloseSVG } from '@/assets/icons/close.svg'
import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute h-full w-full bg-gray-900 opacity-50"
          onClick={onClose}
        />
        <div className="relative z-50 mx-auto w-full max-w-md overflow-y-auto rounded bg-white shadow-lg">
          <Button
            variant="transparent"
            className="absolute right-1 top-4 p-1"
            onClick={onClose}
            icon={
              <IconCloseSVG className="h-6 w-6 text-gray-600 transition duration-300 ease-in-out" />
            }
          />
          <div className="p-2">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal
