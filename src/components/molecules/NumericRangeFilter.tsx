import { FunctionComponent } from 'react'
import { FilterRangeValue } from '@/types'

interface NumericRangeFilterProps {
  id: string
  label: string
  unit?: string
  minVal?: number | string
  maxVal?: number | string
  includeMissing?: boolean
  onChange: (_range: FilterRangeValue) => void
}

const NumericRangeFilter: FunctionComponent<NumericRangeFilterProps> = ({
  id,
  label,
  unit,
  minVal,
  maxVal,
  includeMissing = false,
  onChange,
}) => {
  const buildRangeValue = (
    nextMin: number | string | undefined,
    nextMax: number | string | undefined,
    nextIncludeMissing: boolean,
  ): FilterRangeValue => ({
    ...(nextMin !== undefined ? { min: nextMin } : {}),
    ...(nextMax !== undefined ? { max: nextMax } : {}),
    ...(nextIncludeMissing ? { includeMissing: true } : {}),
  })

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-gray-800">
        <div>
          <span>{label}</span>
          {unit && (
            <span className="ml-1 font-normal text-gray-500">({unit})</span>
          )}
        </div>
        <label
          htmlFor={`${id}-include-missing`}
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-normal text-gray-600 select-none hover:text-gray-800"
        >
          <input
            id={`${id}-include-missing`}
            type="checkbox"
            checked={includeMissing}
            onChange={(e) =>
              onChange(buildRangeValue(minVal, maxVal, e.target.checked))
            }
            className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-gray-800 accent-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-1"
          />
          <span>Include missing</span>
        </label>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            id={`${id}-min`}
            type="number"
            placeholder="Min"
            value={minVal ?? ''}
            onChange={(e) =>
              onChange(
                buildRangeValue(
                  e.target.value !== '' ? e.target.value : undefined,
                  maxVal,
                  includeMissing,
                ),
              )
            }
            className="w-full rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white bg-clip-padding px-2 py-1 text-xs text-gray-800 placeholder-gray-400 focus:border-gray-800 focus:outline-none"
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
              onChange(
                buildRangeValue(
                  minVal,
                  e.target.value !== '' ? e.target.value : undefined,
                  includeMissing,
                ),
              )
            }
            className="w-full rounded-md border-[2px] border-gray-800 border-opacity-50 bg-white bg-clip-padding px-2 py-1 text-xs text-gray-800 placeholder-gray-400 focus:border-gray-800 focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}

export default NumericRangeFilter
