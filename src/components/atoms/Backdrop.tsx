interface BackdropProps extends React.ComponentProps<'div'> {
  isOpen: boolean
}

const Backdrop = ({ isOpen, className, ...rest }: BackdropProps) => {
  return (
    <div
      className={`fixed inset-0 z-[998] bg-gray-900 transition-opacity duration-300 ${className} ${
        isOpen ? 'opacity-50' : 'pointer-events-none opacity-0'
      }`}
      {...rest}
    />
  )
}
export default Backdrop
