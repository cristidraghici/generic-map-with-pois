import Button, { ButtonProps } from '../atoms/Button'
import PlainTooltip, { PlainTooltipProps } from '../atoms/PlainTooltip'

type ButtonWithTooltipProps = ButtonProps & PlainTooltipProps

const ButtonWithTooltip = ({
  tooltip,
  msDelay,
  ...rest
}: ButtonWithTooltipProps) => {
  return (
    <PlainTooltip
      className="text-ellipsis whitespace-nowrap"
      tooltip={tooltip}
      msDelay={msDelay}
    >
      <Button {...rest} />
    </PlainTooltip>
  )
}

export default ButtonWithTooltip
