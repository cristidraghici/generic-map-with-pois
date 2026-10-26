import { CustomRecord, FilterDefinition } from '@/types'

export type FilterValue =
  | string[]
  | string
  | { min?: number | string; max?: number | string }
  | undefined

export type ActiveFilters = Record<string, FilterValue>

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

export const isFilterActive = (
  filter: FilterDefinition,
  value: FilterValue,
): boolean => {
  if (value === undefined || value === null) return false

  if (filter.type === 'checkbox') {
    return Array.isArray(value) && value.length > 0
  }

  if (filter.type === 'select') {
    return typeof value === 'string' && value.trim() !== '' && value !== 'all'
  }

  if (filter.type === 'range') {
    if (typeof value !== 'object' || Array.isArray(value)) return false
    const minSet =
      value.min !== undefined &&
      value.min !== null &&
      value.min !== '' &&
      !Number.isNaN(Number(value.min))
    const maxSet =
      value.max !== undefined &&
      value.max !== null &&
      value.max !== '' &&
      !Number.isNaN(Number(value.max))
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

type CompiledFilter =
  | {
      type: 'checkbox'
      fieldKey: string
      selectedSet: Set<string>
    }
  | {
      type: 'select'
      fieldKey: string
      target: string
    }
  | {
      type: 'range'
      fieldKey: string
      min?: number
      max?: number
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

    if (filter.type === 'checkbox') {
      const selected = Array.isArray(filterVal) ? filterVal : []
      if (selected.length > 0) {
        compiledFilters.push({
          type: 'checkbox',
          fieldKey,
          selectedSet: new Set(selected.map((s) => s.toLowerCase())),
        })
      }
    } else if (filter.type === 'select') {
      const target =
        typeof filterVal === 'string' ? filterVal.toLowerCase().trim() : ''
      if (target && target !== 'all') {
        compiledFilters.push({
          type: 'select',
          fieldKey,
          target,
        })
      }
    } else if (
      filter.type === 'range' &&
      filterVal &&
      typeof filterVal === 'object' &&
      !Array.isArray(filterVal)
    ) {
      const rawMin =
        filterVal.min !== undefined &&
        filterVal.min !== null &&
        filterVal.min !== ''
          ? Number(filterVal.min)
          : undefined
      const rawMax =
        filterVal.max !== undefined &&
        filterVal.max !== null &&
        filterVal.max !== ''
          ? Number(filterVal.max)
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
        const { selectedSet } = filter

        if (Array.isArray(recordVal)) {
          return recordVal.some((item) =>
            selectedSet.has(String(item).toLowerCase()),
          )
        }

        if (record.tags && Array.isArray(record.tags)) {
          const hasTag = record.tags.some((tag) =>
            selectedSet.has(tag.toLowerCase()),
          )
          if (hasTag) return true
        }

        if (recordVal !== undefined && recordVal !== null) {
          return selectedSet.has(String(recordVal).toLowerCase())
        }

        return false
      }

      if (filter.type === 'select') {
        const { target } = filter

        if (Array.isArray(recordVal)) {
          return recordVal.some((item) => String(item).toLowerCase() === target)
        }

        if (record.tags && Array.isArray(record.tags)) {
          if (record.tags.some((t) => t.toLowerCase() === target)) return true
        }

        if (recordVal !== undefined && recordVal !== null) {
          return String(recordVal).toLowerCase() === target
        }

        return false
      }

      if (filter.type === 'range') {
        const numericVal = extractNumericValue(recordVal)
        if (numericVal === null) {
          return false
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
