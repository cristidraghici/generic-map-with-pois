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

export const filterRecords = (
  records: CustomRecord[],
  filters: FilterDefinition[],
  activeFilters: ActiveFilters,
): CustomRecord[] => {
  const activeFilterList = filters.filter((filter) =>
    isFilterActive(filter, activeFilters[filter.id]),
  )

  if (activeFilterList.length === 0) {
    return records
  }

  return records.filter((record) => {
    return activeFilterList.every((filter) => {
      const filterVal = activeFilters[filter.id]
      const fieldKey = filter.field || filter.id
      const recordVal = getRecordFieldValue(record, fieldKey)

      if (filter.type === 'checkbox') {
        const selected = Array.isArray(filterVal) ? filterVal : []
        if (selected.length === 0) return true

        const selectedLower = selected.map((s) => s.toLowerCase())

        // Check if recordVal is an array (e.g. tags or multiple categories)
        if (Array.isArray(recordVal)) {
          return recordVal.some((item) =>
            selectedLower.includes(String(item).toLowerCase()),
          )
        }

        // Check if record has tags array fallback
        if (record.tags && Array.isArray(record.tags)) {
          const hasTag = record.tags.some((tag) =>
            selectedLower.includes(tag.toLowerCase()),
          )
          if (hasTag) return true
        }

        if (recordVal !== undefined && recordVal !== null) {
          return selectedLower.includes(String(recordVal).toLowerCase())
        }

        return false
      }

      if (filter.type === 'select') {
        const target =
          typeof filterVal === 'string' ? filterVal.toLowerCase() : ''
        if (!target || target === 'all') return true

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
        if (
          !filterVal ||
          typeof filterVal !== 'object' ||
          Array.isArray(filterVal)
        ) {
          return true
        }

        const numericVal = extractNumericValue(recordVal)
        if (numericVal === null) {
          return false
        }

        const min =
          filterVal.min !== undefined &&
          filterVal.min !== null &&
          filterVal.min !== ''
            ? Number(filterVal.min)
            : undefined

        const max =
          filterVal.max !== undefined &&
          filterVal.max !== null &&
          filterVal.max !== ''
            ? Number(filterVal.max)
            : undefined

        if (min !== undefined && !Number.isNaN(min) && numericVal < min) {
          return false
        }
        if (max !== undefined && !Number.isNaN(max) && numericVal > max) {
          return false
        }

        return true
      }

      return true
    })
  })
}
