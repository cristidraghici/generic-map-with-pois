import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

interface ImageGalleryProps {
  images: string[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openModal = (index: number) => {
    setCurrentIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen, images.length])

  return (
    <div>
      {images.length > 0 && (
        <ul className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <li key={image} className="w-full cursor-pointer">
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
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80"
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
                onClick={showPrev}
                aria-label="Previous image"
              >
                &#10094;
              </button>

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-4xl font-bold text-white focus:outline-none"
                onClick={showNext}
                aria-label="Next image"
              >
                &#10095;
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

export default ImageGallery
