import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react'

export interface PillButtonProps
  extends Omit<ComponentProps<'button'>, 'children'> {
  active?: boolean
  label: string
}

const PillButton: FunctionComponent<PropsWithChildren<PillButtonProps>> = ({
  active = false,
  label,
  className = '',
  ...rest
}) => {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`
        inline-flex items-center justify-center rounded-full border bg-clip-padding px-2.5 py-1 text-xs font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-1
        ${
          active
            ? 'border-gray-800 bg-gray-800 text-white shadow-sm'
            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500 hover:bg-gray-50'
        }
        ${className}
      `}
      {...rest}
    >
      {label}
    </button>
  )
}

export default PillButton
