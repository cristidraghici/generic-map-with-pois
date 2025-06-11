import { FunctionComponent } from 'react'
import Input from '../atoms/Input'
import { ReactComponent as IconSearchSVG } from '@/assets/icons/search.svg'
import { ReactComponent as IconCloseSVG } from '@/assets/icons/close.svg'

interface SearchFieldProps {
  value: string
  onInputChange: (_value: string) => void
  onCancel: () => void
  className?: string
}

const SearchField: FunctionComponent<SearchFieldProps> = ({
  value,
  onInputChange,
  onCancel,
  className = '',
}) => {
  return (
    <Input
      className={className}
      value={value}
      onChange={(e) => onInputChange(e.target.value)}
      leftIcon={<IconSearchSVG className="fill-gray-800" width={20} />}
      rightIcon={
        value ? (
          <IconCloseSVG className="fill-gray-800" width={20} />
        ) : undefined
      }
      onRightIconClick={value ? onCancel : undefined}
    />
  )
}

export default SearchField
