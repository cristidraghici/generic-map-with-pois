import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ALLOWED_API_URL_PATTERNS,
  DEFAULT_CONFIG,
  ROMANIAN_CITIES_MOCK_DATA_PATH,
  WORLD_CITIES_MOCK_DATA_PATH,
} from '@/constants'
import { toRecordId } from '@/utils/brandTypes'
import fuzzyMatch from '@/utils/fuzzyMatch'
import processApiResponse from '@/utils/processApiResponse'
import { resolveRelativePaths } from '@/utils/resolveRelativePaths'
import mockRomanianCitiesData from '../assets/cities_in_romania.json'
import mockWorldCitiesData from '../assets/world_cities.json'
import { anySuccessfulResponseSchema } from '../schemas'
import {
  Config,
  CustomRecord,
  CustomRecordWithMetadata,
  Metadata,
} from '../types'

const isURLAllowed = (urlToTest: string): boolean => {
  return ALLOWED_API_URL_PATTERNS.some((pattern) => pattern.test(urlToTest))
}

const useFetchData = (url?: string, search?: string) => {
  const [records, setRecords] = useState<CustomRecord[]>([])
  const [metadata, setMetadata] = useState<Metadata>('')
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [_reloadCounter, setReloadCounter] = useState(0)

  const handleSetRecords = useCallback((records: CustomRecord[]) => {
    const recordsWithIds = records.map((record, index) => ({
      ...record,
      id: toRecordId(record.id ? record.id : `id_${index.toString(36)}`),
    }))
    setRecords(recordsWithIds)
  }, [])

  const filteredRecords = useMemo((): CustomRecord[] => {
    if (!search) return records

    return records.filter((record) => {
      const descriptionText = Array.isArray(record.description)
        ? record.description.join(' ')
        : record.description || ''

      const searchableText = `${record.title} ${descriptionText}`
      return fuzzyMatch(searchableText, search, true)
    })
  }, [records, search])

  useEffect(() => {
    if (!url) return

    if (url === ROMANIAN_CITIES_MOCK_DATA_PATH) {
      const {
        records,
        metadata,
        config = DEFAULT_CONFIG,
      } = processApiResponse(mockRomanianCitiesData as CustomRecordWithMetadata)

      handleSetRecords(records)
      setMetadata(metadata)
      setConfig(config)
      return
    }

    if (url === WORLD_CITIES_MOCK_DATA_PATH) {
      const {
        records,
        metadata,
        config = DEFAULT_CONFIG,
      } = processApiResponse(mockWorldCitiesData as CustomRecordWithMetadata)

      handleSetRecords(records)
      setMetadata(metadata)
      setConfig(config)
      return
    }

    if (!isURLAllowed(url)) {
      setError('Invalid API URL: URL does not match security requirements')
      return
    }

    const controller = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const validatedResponse = anySuccessfulResponseSchema.safeParse(data)
        if (!validatedResponse.success) {
          throw new Error('Invalid response format: Could not parse entities')
        }

        // Resolve relative paths in the JSON data based on the API URL
        const resolvedData = resolveRelativePaths(data, url)
        const { records, metadata, config } = processApiResponse(resolvedData)

        handleSetRecords(records)
        setMetadata(metadata)
        setConfig({ ...DEFAULT_CONFIG, ...config })
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [url, handleSetRecords])

  const reload = useCallback(() => setReloadCounter((prev) => prev + 1), [])

  return {
    records: filteredRecords,
    metadata,
    config,
    loading,
    error,
    reload,
  }
}

export default useFetchData
