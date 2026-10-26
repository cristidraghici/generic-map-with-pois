import { FunctionComponent } from 'react'

interface NumericRangeFilterProps {
  id: string
  label: string
  unit?: string
  minVal?: number | string
  maxVal?: number | string
  onChange: (_range: { min?: number | string; max?: number | string }) => void
}

const NumericRangeFilter: FunctionComponent<NumericRangeFilterProps> = ({
  id,
  label,
  unit,
  minVal,
  maxVal,
  onChange,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
        <span>{label}</span>
        {unit && <span className="font-normal text-gray-500">({unit})</span>}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            id={`${id}-min`}
            type="number"
            placeholder="Min"
            value={minVal ?? ''}
            onChange={(e) =>
              onChange({
                min: e.target.value !== '' ? e.target.value : undefined,
                max: maxVal,
              })
            }
            className="w-full rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white px-2 py-1 text-xs text-gray-800 placeholder-gray-400 focus:border-gray-800 focus:outline-none"
          />
        </div>
        <span className="text-xs text-gray-500">–</span>
        <div className="relative flex-1">
          <input
            id={`${id}-max`}
            type="number"
            placeholder="Max"
            value={maxVal ?? ''}
            onChange={(e) =>
              onChange({
                min: minVal,
                max: e.target.value !== '' ? e.target.value : undefined,
              })
            }
            className="w-full rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white px-2 py-1 text-xs text-gray-800 placeholder-gray-400 focus:border-gray-800 focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}

export default NumericRangeFilter
