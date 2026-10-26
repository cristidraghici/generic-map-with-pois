import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ALLOWED_API_URL_PATTERNS,
  DEFAULT_CONFIG,
  MULTI_LAYER_SAMPLE_MOCK_DATA_PATH,
  NATIONAL_PARKS_MOCK_DATA_PATH,
  PARIS_LANDMARKS_MOCK_DATA_PATH,
  ROMANIAN_CITIES_MOCK_DATA_PATH,
  SPACE_LAUNCH_SITES_MOCK_DATA_PATH,
  WORLD_CITIES_MOCK_DATA_PATH,
} from '@/constants'
import { toRecordId } from '@/utils/brandTypes'
import { fuzzyMatchIndexed, getMaxFuzzyDistance } from '@/utils/fuzzyMatch'
import getDatasetLabel from '@/utils/getDatasetLabel'
import processApiResponse from '@/utils/processApiResponse'
import { resolveRelativePaths } from '@/utils/resolveRelativePaths'
import { anySuccessfulResponseSchema } from '../schemas'
import {
  AnySuccessfulResponse,
  Config,
  CustomRecord,
  FilterDefinition,
  Layer,
  Metadata,
} from '../types'

const MOCK_DATASET_LOADERS: Record<
  string,
  () => Promise<{ default: unknown }>
> = {
  [ROMANIAN_CITIES_MOCK_DATA_PATH]: () =>
    import('../assets/cities_in_romania.json'),
  [MULTI_LAYER_SAMPLE_MOCK_DATA_PATH]: () =>
    import('../assets/multi_layer_sample.json'),
  [WORLD_CITIES_MOCK_DATA_PATH]: () => import('../assets/world_cities.json'),
  [PARIS_LANDMARKS_MOCK_DATA_PATH]: () =>
    import('../assets/cultural_landmarks_paris.json'),
  [NATIONAL_PARKS_MOCK_DATA_PATH]: () =>
    import('../assets/national_parks.json'),
  [SPACE_LAUNCH_SITES_MOCK_DATA_PATH]: () =>
    import('../assets/space_launch_sites.json'),
}

/**
 * Separator used to build a stable key out of the list of URLs
 */
const URLS_KEY_SEPARATOR = '\n'

interface IndexedRecord {
  record: CustomRecord
  normalizedText: string
  tokens: readonly string[]
}

interface DatasetState {
  loading: boolean
  error: string | null
  title?: string
  records: CustomRecord[]
  searchEntries: IndexedRecord[]
  metadata: Metadata
  config: Config
  layers: Layer[]
  filters: FilterDefinition[]
}

export interface DatasetOption {
  url: string
  label: string
}

const EMPTY_DATASET: DatasetState = {
  loading: false,
  error: null,
  records: [],
  searchEntries: [],
  metadata: '',
  config: DEFAULT_CONFIG,
  layers: [],
  filters: [],
}

const isURLAllowed = (urlToTest: string): boolean => {
  try {
    const parsed = new URL(urlToTest)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false
    }
  } catch {
    return false
  }
  return ALLOWED_API_URL_PATTERNS.some((pattern) => pattern.test(urlToTest))
}

const toDatasetState = (response: AnySuccessfulResponse): DatasetState => {
  const { title, metadata, config, layers, filters } =
    processApiResponse(response)
  let generatedCounter = 0
  const normalizedLayers = layers.map((layer) => {
    const layerRecords = layer.records.map((record) => {
      const id = record.id
        ? toRecordId(record.id)
        : toRecordId(`id_${(generatedCounter++).toString(36)}`)
      return { ...record, id, layerId: layer.id }
    })
    return {
      ...layer,
      records: layerRecords,
    }
  })
  const allRecords = normalizedLayers.flatMap((l) => l.records)
  const searchEntries: IndexedRecord[] = allRecords.map((record) => {
    const descriptionText = Array.isArray(record.description)
      ? record.description.join(' ')
      : record.description || ''
    const normalizedText = `${record.title} ${descriptionText}`.toLowerCase()
    const tokens = normalizedText.split(/\s+/).filter(Boolean)
    return {
      record,
      normalizedText,
      tokens,
    }
  })

  return {
    loading: false,
    error: null,
    title,
    records: allRecords,
    searchEntries,
    metadata,
    config,
    layers: normalizedLayers,
    filters,
  }
}

/**
 * Fetches all the provided datasets in parallel and keeps them in memory,
 * exposing the records of the selected one
 */
const useFetchData = (
  urls: string[],
  selectedIndex: number,
  search?: string,
) => {
  const [datasets, setDatasets] = useState<Record<string, DatasetState>>({})
  const controllersRef = useRef<Map<string, AbortController>>(new Map())

  // Keep a stable reference to the list of URLs, as the array identity may change on URL updates
  const urlsKey = urls.join(URLS_KEY_SEPARATOR)
  const stableUrls = useMemo(
    () => (urlsKey ? urlsKey.split(URLS_KEY_SEPARATOR) : []),
    [urlsKey],
  )

  const selectedUrl: string | undefined = stableUrls[selectedIndex]
  const selectedDataset =
    (selectedUrl && datasets[selectedUrl]) || EMPTY_DATASET

  const updateDataset = useCallback(
    (url: string, patch: Partial<DatasetState>) => {
      setDatasets((prev) => ({
        ...prev,
        [url]: { ...(prev[url] ?? EMPTY_DATASET), ...patch },
      }))
    },
    [],
  )

  const loadDataset = useCallback(
    async (url: string, signal: AbortSignal) => {
      const mockLoader = MOCK_DATASET_LOADERS[url]
      if (mockLoader) {
        try {
          updateDataset(url, { loading: true, error: null })
          const module = await mockLoader()
          if (signal.aborted) return

          const validatedResponse = anySuccessfulResponseSchema.safeParse(
            module.default,
          )
          if (!validatedResponse.success) {
            throw new Error(
              'Invalid response format: Could not parse mock entities',
            )
          }
          updateDataset(url, toDatasetState(validatedResponse.data))
        } catch (error) {
          if (signal.aborted) return
          updateDataset(url, {
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : 'An unknown error occurred',
          })
        }
        return
      }

      if (!isURLAllowed(url)) {
        updateDataset(url, {
          loading: false,
          error: 'Invalid API URL: URL does not match security requirements',
        })
        return
      }

      try {
        updateDataset(url, { loading: true, error: null })

        const response = await fetch(url, { signal })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const validatedResponse = anySuccessfulResponseSchema.safeParse(data)
        if (!validatedResponse.success) {
          throw new Error('Invalid response format: Could not parse entities')
        }

        // Resolve relative paths in the JSON data based on the API URL
        const resolvedData = resolveRelativePaths(validatedResponse.data, url)
        updateDataset(url, toDatasetState(resolvedData))
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        updateDataset(url, {
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
        })
      }
    },
    [updateDataset],
  )

  useEffect(() => {
    const activeUrlSet = new Set(stableUrls)
    const controllers = controllersRef.current

    for (const [trackedUrl, controller] of controllers.entries()) {
      if (!activeUrlSet.has(trackedUrl)) {
        controller.abort()
        controllers.delete(trackedUrl)
      }
    }

    for (const url of activeUrlSet) {
      if (!controllers.has(url)) {
        const controller = new AbortController()
        controllers.set(url, controller)
        loadDataset(url, controller.signal)
      }
    }
  }, [stableUrls, loadDataset])

  useEffect(() => {
    const controllers = controllersRef.current
    return () => {
      for (const controller of controllers.values()) {
        controller.abort()
      }
      controllers.clear()
    }
  }, [])

  /**
   * Manually refreshes the selected dataset only
   */
  const reload = useCallback(() => {
    if (!selectedUrl) return

    const existingController = controllersRef.current.get(selectedUrl)
    existingController?.abort()

    const controller = new AbortController()
    controllersRef.current.set(selectedUrl, controller)

    loadDataset(selectedUrl, controller.signal)
  }, [selectedUrl, loadDataset])

  const filteredRecords = useMemo((): CustomRecord[] => {
    const { records, searchEntries } = selectedDataset
    const normalizedQuery = search?.trim().toLowerCase() ?? ''
    if (!normalizedQuery) return records

    const maxAllowedDistance = getMaxFuzzyDistance(normalizedQuery.length)
    const matched: CustomRecord[] = []

    for (let i = 0; i < searchEntries.length; i++) {
      const entry = searchEntries[i]
      if (
        fuzzyMatchIndexed(
          entry.normalizedText,
          entry.tokens,
          normalizedQuery,
          maxAllowedDistance,
        )
      ) {
        matched.push(entry.record)
      }
    }

    return matched
  }, [selectedDataset, search])

  const datasetOptions = useMemo(
    (): DatasetOption[] =>
      stableUrls.map((url) => ({
        url,
        label: getDatasetLabel(
          url,
          datasets[url]?.title,
          datasets[url]?.metadata,
        ),
      })),
    [stableUrls, datasets],
  )

  return {
    allRecords: selectedDataset.records,
    records: filteredRecords,
    metadata: selectedDataset.metadata,
    config: selectedDataset.config,
    layers: selectedDataset.layers,
    loading: selectedDataset.loading,
    error: selectedDataset.error,
    datasets: datasetOptions,
    filters: selectedDataset.filters || [],
    reload,
  }
}

export default useFetchData
