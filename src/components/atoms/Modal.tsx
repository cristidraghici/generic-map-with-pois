import {
  ComponentProps,
  FunctionComponent,
  MouseEvent,
  PropsWithChildren,
  useMemo,
} from 'react'
import { ReactComponent as IconCloseSVG } from '@/assets/icons/close.svg'
import useKeyPress from '@/hooks/useKeyPress'
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
  const keyActions = useMemo(
    () => [{ key: 'Escape', action: onClose }],
    [onClose],
  )

  useKeyPress(keyActions, isOpen)

  const handleContainerClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <>
      <Backdrop onClick={onClose} isOpen={isOpen} />

      <div
        role="dialog"
        aria-modal={isOpen}
        aria-hidden={!isOpen}
        {...(!isOpen ? ({ inert: '' } as Record<string, string>) : {})}
        {...rest}
        className={`fixed inset-0 z-[999] flex items-center justify-center p-3 transition-opacity duration-300 ${className} ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={handleContainerClick}
      >
        <div className="relative z-[999] mx-auto w-full max-w-md rounded-lg bg-white shadow-xl">
          <Button
            variant="transparent"
            aria-label="Close dialog"
            className="absolute right-3 top-3 z-10"
            onClick={onClose}
            icon={
              <IconCloseSVG
                aria-hidden="true"
                className="h-5 w-5 text-gray-500 transition duration-200 ease-in-out hover:text-gray-800"
              />
            }
          />
          <div className="max-h-[80vh] overflow-y-auto p-4 pr-12">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
