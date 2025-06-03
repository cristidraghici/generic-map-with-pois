interface BackdropProps {
  isOpen: boolean
  onClose: () => void
}

export const Backdrop = ({ isOpen, onClose }: BackdropProps) => {
  return (
    <div
      className={`fixed inset-0 z-[998] bg-gray-900 transition-opacity duration-300 ${
        isOpen ? 'opacity-50' : 'pointer-events-none opacity-0'
      }`}
      onClick={onClose}
    />
  )
}
export default Backdrop
