import React, { useCallback, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import useKeyPress from '../../hooks/useKeyPress'
import Backdrop from '../atoms/Backdrop'

interface ImageGalleryProps {
  images: string[]
  isPageBreakBeforeMediaInPDFEnabled?: boolean
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  isPageBreakBeforeMediaInPDFEnabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openModal = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const showPrevClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    },
    [images.length],
  )

  const showNextClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentIndex((prev) => (prev + 1) % images.length)
    },
    [images.length],
  )

  const handlePrevKey = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const handleNextKey = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const keyActions = useMemo(
    () => [
      { key: 'Escape', action: closeModal },
      { key: 'ArrowLeft', action: handlePrevKey },
      { key: 'ArrowRight', action: handleNextKey },
    ],
    [closeModal, handlePrevKey, handleNextKey],
  )

  useKeyPress(keyActions, isModalOpen)

  return (
    <>
      {images.length > 0 && (
        <ul className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <li
              key={image}
              className={`w-full cursor-pointer ${
                isPageBreakBeforeMediaInPDFEnabled
                  ? 'pdf-page-break-before'
                  : ''
              }`}
            >
              <button
                type="button"
                onClick={() => openModal(index)}
                className="block w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <img
                  src={image}
                  alt=""
                  className="h-auto w-full rounded shadow"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen &&
        ReactDOM.createPortal(
          <React.Fragment>
            <Backdrop
              isOpen={isModalOpen}
              onClick={closeModal}
              className="z-[9998]"
            />
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center"
              onClick={closeModal}
              aria-modal="true"
              aria-label="Image viewer"
            >
              <div
                className="relative mx-auto max-h-[90vh] max-w-4xl p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[currentIndex]}
                  alt=""
                  className="mx-auto max-h-[80vh] w-auto rounded shadow-lg"
                />

                <button
                  type="button"
                  className="absolute right-4 top-4 p-4 text-2xl font-bold text-white focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeModal()
                  }}
                  aria-label="Close image viewer"
                >
                  &times;
                </button>

                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-4xl font-bold text-white focus:outline-none"
                  onClick={showPrevClick}
                  aria-label="Previous image"
                >
                  &#10094;
                </button>

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-4xl font-bold text-white focus:outline-none"
                  onClick={showNextClick}
                  aria-label="Next image"
                >
                  &#10095;
                </button>
              </div>
            </div>
          </React.Fragment>,
          document.body,
        )}
    </>
  )
}

export default ImageGallery
