import { useState, useEffect, useCallback } from 'react'
import { customMarkerSchema, customMarkerWithMetadataSchema } from '../schemas'
import mockData from '../assets/cities_in_romania.json'
import {
  Config,
  CustomMarker,
  CustomMarkerWithMetadata,
  Metadata,
} from '../types'

/**
 * Regular expressions for validating API URLs
 * Acts as a basic security measure against malicious URLs
 */
const ALLOWED_API_URL_PATTERNS: RegExp[] = [
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, // Matches pages URLs, e.g. Github
  /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?([/\w .-]*)*\/?$/, // Matches localhost and IP
]

const DEFAULT_MOCK_DATA_PATH = '/cities_in_romania.json'
const DEFAULT_CONFIG: Config = {
  typeOfIcon: 'default',
}

const useGetPOIs = (url?: string, search?: string) => {
  const [records, setRecords] = useState<CustomMarker[]>([])
  const [metadata, setMetadata] = useState<Metadata>('')
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [reloadCounter, setReloadCounter] = useState(0)

  const loadMockData = useCallback(() => {
    const {
      records,
      metadata,
      config = DEFAULT_CONFIG,
    } = mockData as CustomMarkerWithMetadata

    setRecords(records)
    setMetadata(metadata)
    setConfig(config)
  }, [])

  const isURLAllowed = useCallback((urlToTest: string): boolean => {
    return ALLOWED_API_URL_PATTERNS.some((pattern) => pattern.test(urlToTest))
  }, [])

  const getFilteredRecords = useCallback(
    (records: CustomMarker[], searchTerm?: string) => {
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

  const processAPIResponse = useCallback(
    (data: CustomMarker[] | CustomMarkerWithMetadata) => {
      const hasMetadata = !Array.isArray(data)

      if (hasMetadata) {
        const validatedResponse = customMarkerWithMetadataSchema.safeParse(data)
        if (!validatedResponse.success) {
          throw new Error(
            'Invalid response format: Could not parse entities with metadata',
          )
        }

        setRecords(validatedResponse.data.records)
        setMetadata(validatedResponse.data.metadata)
        if (validatedResponse.data.config) {
          setConfig({ ...DEFAULT_CONFIG, ...validatedResponse.data.config })
        }
        return
      }

      const validatedResponse = customMarkerSchema.array().safeParse(data)
      if (!validatedResponse.success) {
        throw new Error('Invalid response format: Could not parse entities')
      }

      setRecords(validatedResponse.data)
      setMetadata('')
      setConfig(DEFAULT_CONFIG)
    },
    [],
  )

  useEffect(() => {
    if (!url) return

    if (url === DEFAULT_MOCK_DATA_PATH) {
      loadMockData()
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
        processAPIResponse(data)
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
  }, [url, reloadCounter, loadMockData, isURLAllowed, processAPIResponse])

  return {
    records: getFilteredRecords(records, search),
    metadata,
    config,
    loading,
    error,
    reload: useCallback(() => setReloadCounter((prev) => prev + 1), []),
  }
}

export default useGetPOIs
