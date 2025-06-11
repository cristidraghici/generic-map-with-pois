import { useState, useEffect, useCallback } from 'react'
import { anySuccessfulResponseSchema } from '../schemas'
import mockData from '../assets/cities_in_romania.json'
import {
  Config,
  CustomRecord,
  CustomRecordWithMetadata,
  Metadata,
} from '../types'
import processApiResponse from '@/utils/processApiResponse'

import {
  ALLOWED_API_URL_PATTERNS,
  DEFAULT_MOCK_DATA_PATH,
  DEFAULT_CONFIG,
} from '@/constants'

const useFetchData = (url?: string, search?: string) => {
  const [records, setRecords] = useState<CustomRecord[]>([])
  const [metadata, setMetadata] = useState<Metadata>('')
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [reloadCounter, setReloadCounter] = useState(0)

  const isURLAllowed = useCallback((urlToTest: string): boolean => {
    return ALLOWED_API_URL_PATTERNS.some((pattern) => pattern.test(urlToTest))
  }, [])

  const getFilteredRecords = useCallback(
    (records: CustomRecord[], searchTerm?: string): CustomRecord[] => {
      if (!searchTerm) return records

      return records.filter((record) => {
        const descriptionText = Array.isArray(record.description)
          ? record.description.join(' ')
          : record.description || ''

        const searchableText =
          `${record.title} ${descriptionText}`.toLowerCase()
        return searchableText.includes(searchTerm.toLowerCase())
      })
    },
    [],
  )

  useEffect(() => {
    if (!url) return

    if (url === DEFAULT_MOCK_DATA_PATH) {
      const {
        records,
        metadata,
        config = DEFAULT_CONFIG,
      } = processApiResponse(mockData as CustomRecordWithMetadata)

      setRecords(records)
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

        const { records, metadata, config } = processApiResponse(
          validatedResponse.data,
        )

        setRecords(records)
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
  }, [url, reloadCounter, isURLAllowed])

  const reload = useCallback(() => setReloadCounter((prev) => prev + 1), [])

  return {
    records: getFilteredRecords(records, search),
    metadata,
    config,
    loading,
    error,
    reload,
  }
}

export default useFetchData
