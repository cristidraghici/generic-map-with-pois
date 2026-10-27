import { SAVED_FILTERS_STORAGE_PREFIX } from '@/constants'
import { activeFiltersSchema } from '@/schemas'
import {
  ActiveFilters,
  CustomRecord,
  FilterDefinition,
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

    if (filter.type === 'checkbox') {
      const aList = Array.isArray(aVal)
        ? Array.from(new Set(aVal.map((v) => v.trim().toLowerCase()))).sort()
        : []
      const bList = Array.isArray(bVal)
        ? Array.from(new Set(bVal.map((v) => v.trim().toLowerCase()))).sort()
        : []
      if (aList.length !== bList.length) return false
      for (let i = 0; i < aList.length; i++) {
        if (aList[i] !== bList[i]) return false
      }
    } else if (filter.type === 'select') {
      const aTarget = typeof aVal === 'string' ? aVal.trim().toLowerCase() : ''
      const bTarget = typeof bVal === 'string' ? bVal.trim().toLowerCase() : ''
      if (aTarget !== bTarget) return false
    } else if (filter.type === 'range') {
      const aRange =
        aVal && typeof aVal === 'object' && !Array.isArray(aVal) ? aVal : {}
      const bRange =
        bVal && typeof bVal === 'object' && !Array.isArray(bVal) ? bVal : {}
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
