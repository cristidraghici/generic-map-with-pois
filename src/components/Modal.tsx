import { FunctionComponent, PropsWithChildren, useEffect, useRef } from 'react'
import { ReactComponent as IconCloseSVG } from '../assets/icons/close.svg'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const overlayElement = overlayRef.current

    if (!overlayElement) {
      return
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }

    // Add the event listener when the component mounts
    window.addEventListener('keydown', handleEscapeKey)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleEscapeKey)
    }
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          ref={overlayRef}
          className="absolute h-full w-full bg-gray-900 opacity-50"
          onClick={() => onClose()}
        />
        <div className="relative z-50 mx-auto w-full max-w-md overflow-y-auto rounded bg-white shadow-lg">
          <div className="absolute right-1 top-4 cursor-pointer rounded-full bg-white p-1">
            <IconCloseSVG
              className="h-6 w-6 text-gray-600 transition duration-300 ease-in-out hover:text-gray-800"
              onClick={onClose}
            />
          </div>
          <div className="p-2">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal
