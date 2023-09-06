import { FunctionComponent, PropsWithChildren, useEffect, useRef } from "react";
import { ReactComponent as IconCloseSVG } from "../assets/icons/close.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const overlayElement = overlayRef.current;

    if (!overlayElement) {
      return;
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener("keydown", handleEscapeKey);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[99999] ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          ref={overlayRef}
          className="absolute w-full h-full bg-gray-900 opacity-50"
          onClick={() => onClose()}
        />
        <div className="relative bg-white w-full max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
          <div className="absolute top-4 right-1 cursor-pointer p-1 bg-white rounded-full">
            <IconCloseSVG
              className="w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
              onClick={onClose}
            />
          </div>
          <div className="p-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
