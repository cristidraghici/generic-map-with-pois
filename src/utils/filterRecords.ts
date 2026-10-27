import { SAVED_FILTERS_STORAGE_PREFIX } from '@/constants'
import { activeFiltersSchema } from '@/schemas'
import {
  ActiveFilters,
  CustomRecord,
  FilterDefinition,
  FilterRangeValue,
  FilterValue,
} from '@/types'

export type { ActiveFilters, FilterValue }

const extractNumericValue = (val: unknown): number | null => {
  if (typeof val === 'number') {
    return Number.isFinite(val) ? val : null
  }
  if (typeof val === 'string') {
    const cleaned = val.replace(/,/g, '').trim()
    const match = cleaned.match(/-?\d+(\.\d+)?/)
    if (match) {
      const parsed = parseFloat(match[0])
      return Number.isFinite(parsed) ? parsed : null
    }
  }
  return null
}

const isFieldValueMissing = (val: unknown): boolean => {
  if (val === undefined || val === null) return true
  if (typeof val === 'string') return val.trim() === ''
  if (Array.isArray(val)) {
    return (
      val.length === 0 ||
      val.every(
        (item) =>
          item === undefined || item === null || String(item).trim() === '',
      )
    )
  }
  return false
}

const getRecordFieldValue = (
  record: CustomRecord,
  fieldKey: string,
): unknown => {
  const recordAny = record as unknown as Record<string, unknown>
  if (recordAny[fieldKey] !== undefined) {
    return recordAny[fieldKey]
  }
  if (record.properties && record.properties[fieldKey] !== undefined) {
    return record.properties[fieldKey]
  }
  return undefined
}

export const getCheckboxValues = (value: FilterValue): string[] => {
  if (Array.isArray(value)) return value
  if (
    value &&
    typeof value === 'object' &&
    'values' in value &&
    Array.isArray(value.values)
  ) {
    return value.values
  }
  return []
}

export const getSelectValue = (value: FilterValue): string => {
  if (typeof value === 'string') return value
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'value' in value &&
    typeof value.value === 'string'
  ) {
    return value.value
  }
  return ''
}

export const getRangeValue = (value: FilterValue): FilterRangeValue => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      min: 'min' in value ? value.min : undefined,
      max: 'max' in value ? value.max : undefined,
      includeMissing: value.includeMissing,
    }
  }
  return {}
}

export const getIncludeMissing = (value: FilterValue): boolean => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value.includeMissing === true
  }
  return false
}

export const isFilterActive = (
  filter: FilterDefinition,
  value: FilterValue,
): boolean => {
  if (value === undefined || value === null) return false

  if (filter.type === 'checkbox') {
    return getCheckboxValues(value).length > 0
  }

  if (filter.type === 'select') {
    const selected = getSelectValue(value).trim()
    return selected !== '' && selected !== 'all'
  }

  if (filter.type === 'range') {
    const range = getRangeValue(value)
    const minSet =
      range.min !== undefined &&
      range.min !== null &&
      range.min !== '' &&
      !Number.isNaN(Number(range.min))
    const maxSet =
      range.max !== undefined &&
      range.max !== null &&
      range.max !== '' &&
      !Number.isNaN(Number(range.max))
    return minSet || maxSet
  }

  return false
}

export const getActiveFilterCount = (
  filters: FilterDefinition[],
  activeFilters: ActiveFilters,
): number => {
  return filters.reduce((count, filter) => {
    return count + (isFilterActive(filter, activeFilters[filter.id]) ? 1 : 0)
  }, 0)
}

export const hasAnyFilterState = (
  filters: FilterDefinition[],
  activeFilters: ActiveFilters,
): boolean => {
  return filters.some((filter) => {
    const val = activeFilters[filter.id]
    return isFilterActive(filter, val) || getIncludeMissing(val)
  })
}

const getRangeBound = (
  bound: number | string | undefined,
): number | undefined => {
  if (bound === undefined || bound === null || bound === '') return undefined
  const parsed = Number(bound)
  return Number.isNaN(parsed) ? undefined : parsed
}

export const areFiltersEqual = (
  filters: FilterDefinition[],
  a: ActiveFilters,
  b: ActiveFilters,
): boolean => {
  for (const filter of filters) {
    const aVal = a[filter.id]
    const bVal = b[filter.id]
    const aActive = isFilterActive(filter, aVal)
    const bActive = isFilterActive(filter, bVal)

    if (!aActive && !bActive) continue
    if (aActive !== bActive) return false
    if (getIncludeMissing(aVal) !== getIncludeMissing(bVal)) return false

    if (filter.type === 'checkbox') {
      const aList = Array.from(
        new Set(getCheckboxValues(aVal).map((v) => v.trim().toLowerCase())),
      ).sort()
      const bList = Array.from(
        new Set(getCheckboxValues(bVal).map((v) => v.trim().toLowerCase())),
      ).sort()
      if (aList.length !== bList.length) return false
      for (let i = 0; i < aList.length; i++) {
        if (aList[i] !== bList[i]) return false
      }
    } else if (filter.type === 'select') {
      const aTarget = getSelectValue(aVal).trim().toLowerCase()
      const bTarget = getSelectValue(bVal).trim().toLowerCase()
      if (aTarget !== bTarget) return false
    } else if (filter.type === 'range') {
      const aRange = getRangeValue(aVal)
      const bRange = getRangeValue(bVal)
      if (
        getRangeBound(aRange.min) !== getRangeBound(bRange.min) ||
        getRangeBound(aRange.max) !== getRangeBound(bRange.max)
      ) {
        return false
      }
    }
  }

  return true
}

export const getSavedFiltersForSource = (sourceUrl: string): ActiveFilters => {
  if (!sourceUrl || typeof window === 'undefined') return {}

  try {
    const raw = window.localStorage.getItem(
      `${SAVED_FILTERS_STORAGE_PREFIX}${sourceUrl}`,
    )
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    const validated = activeFiltersSchema.safeParse(parsed)
    return validated.success ? validated.data : {}
  } catch {
    return {}
  }
}

export const saveFiltersForSource = (
  sourceUrl: string,
  filters: FilterDefinition[],
  activeFilters: ActiveFilters,
): ActiveFilters => {
  const cleaned: ActiveFilters = {}

  for (const filter of filters) {
    const val = activeFilters[filter.id]
    if (isFilterActive(filter, val)) {
      cleaned[filter.id] = val
    }
  }

  if (!sourceUrl || typeof window === 'undefined') return cleaned

  try {
    const key = `${SAVED_FILTERS_STORAGE_PREFIX}${sourceUrl}`
    if (Object.keys(cleaned).length > 0) {
      window.localStorage.setItem(key, JSON.stringify(cleaned))
    } else {
      window.localStorage.removeItem(key)
    }
  } catch {
    // Ignore storage quota or private mode restrictions
  }

  return cleaned
}

export const clearSavedFiltersForSource = (sourceUrl: string): void => {
  if (!sourceUrl || typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(
      `${SAVED_FILTERS_STORAGE_PREFIX}${sourceUrl}`,
    )
  } catch {
    // Ignore storage restrictions
  }
}

type CompiledFilter =
  | {
      type: 'checkbox'
      fieldKey: string
      selectedSet: Set<string>
      includeMissing: boolean
    }
  | {
      type: 'select'
      fieldKey: string
      target: string
      includeMissing: boolean
    }
  | {
      type: 'range'
      fieldKey: string
      min?: number
      max?: number
      includeMissing: boolean
    }

export const filterRecords = (
  records: CustomRecord[],
  filters: FilterDefinition[],
  activeFilters: ActiveFilters,
): CustomRecord[] => {
  const compiledFilters: CompiledFilter[] = []

  for (const filter of filters) {
    const filterVal = activeFilters[filter.id]
    if (!isFilterActive(filter, filterVal)) continue

    const fieldKey = filter.field || filter.id
    const includeMissing = getIncludeMissing(filterVal)

    if (filter.type === 'checkbox') {
      const selected = getCheckboxValues(filterVal)
      if (selected.length > 0) {
        compiledFilters.push({
          type: 'checkbox',
          fieldKey,
          selectedSet: new Set(selected.map((s) => s.toLowerCase())),
          includeMissing,
        })
      }
    } else if (filter.type === 'select') {
      const target = getSelectValue(filterVal).toLowerCase().trim()
      if (target && target !== 'all') {
        compiledFilters.push({
          type: 'select',
          fieldKey,
          target,
          includeMissing,
        })
      }
    } else if (filter.type === 'range') {
      const rangeVal = getRangeValue(filterVal)
      const rawMin =
        rangeVal.min !== undefined &&
        rangeVal.min !== null &&
        rangeVal.min !== ''
          ? Number(rangeVal.min)
          : undefined
      const rawMax =
        rangeVal.max !== undefined &&
        rangeVal.max !== null &&
        rangeVal.max !== ''
          ? Number(rangeVal.max)
          : undefined
      const min =
        rawMin !== undefined && !Number.isNaN(rawMin) ? rawMin : undefined
      const max =
        rawMax !== undefined && !Number.isNaN(rawMax) ? rawMax : undefined

      if (min !== undefined || max !== undefined) {
        compiledFilters.push({
          type: 'range',
          fieldKey,
          min,
          max,
          includeMissing,
        })
      }
    }
  }

  if (compiledFilters.length === 0) {
    return records
  }

  return records.filter((record) => {
    return compiledFilters.every((filter) => {
      const recordVal = getRecordFieldValue(record, filter.fieldKey)

      if (filter.type === 'checkbox') {
        const { selectedSet, includeMissing } = filter

        if (Array.isArray(recordVal) && !isFieldValueMissing(recordVal)) {
          return recordVal.some((item) =>
            selectedSet.has(String(item).trim().toLowerCase()),
          )
        }

        if (record.tags && Array.isArray(record.tags)) {
          const hasTag = record.tags.some((tag) =>
            selectedSet.has(tag.toLowerCase()),
          )
          if (hasTag) return true
        }

        if (!isFieldValueMissing(recordVal)) {
          return selectedSet.has(String(recordVal).trim().toLowerCase())
        }

        return includeMissing
      }

      if (filter.type === 'select') {
        const { target, includeMissing } = filter

        if (Array.isArray(recordVal) && !isFieldValueMissing(recordVal)) {
          return recordVal.some(
            (item) => String(item).trim().toLowerCase() === target,
          )
        }

        if (record.tags && Array.isArray(record.tags)) {
          if (record.tags.some((t) => t.toLowerCase() === target)) return true
        }

        if (!isFieldValueMissing(recordVal)) {
          return String(recordVal).trim().toLowerCase() === target
        }

        return includeMissing
      }

      if (filter.type === 'range') {
        const numericVal = extractNumericValue(recordVal)
        if (numericVal === null) {
          return filter.includeMissing
        }

        if (filter.min !== undefined && numericVal < filter.min) {
          return false
        }
        if (filter.max !== undefined && numericVal > filter.max) {
          return false
        }

        return true
      }

      return true
    })
  })
}
