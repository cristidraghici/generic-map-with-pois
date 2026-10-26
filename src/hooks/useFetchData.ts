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
import fuzzyMatch from '@/utils/fuzzyMatch'
import getDatasetLabel from '@/utils/getDatasetLabel'
import processApiResponse from '@/utils/processApiResponse'
import { resolveRelativePaths } from '@/utils/resolveRelativePaths'
import mockRomanianCitiesData from '../assets/cities_in_romania.json'
import mockParisLandmarksData from '../assets/cultural_landmarks_paris.json'
import mockMultiLayerSampleData from '../assets/multi_layer_sample.json'
import mockNationalParksData from '../assets/national_parks.json'
import mockSpaceLaunchSitesData from '../assets/space_launch_sites.json'
import mockWorldCitiesData from '../assets/world_cities.json'
import { anySuccessfulResponseSchema } from '../schemas'
import {
  AnySuccessfulResponse,
  Config,
  CustomRecord,
  Layer,
  Metadata,
} from '../types'

const MOCK_DATASETS: Record<string, AnySuccessfulResponse> = {
  [ROMANIAN_CITIES_MOCK_DATA_PATH]:
    mockRomanianCitiesData as AnySuccessfulResponse,
  [MULTI_LAYER_SAMPLE_MOCK_DATA_PATH]:
    mockMultiLayerSampleData as AnySuccessfulResponse,
  [WORLD_CITIES_MOCK_DATA_PATH]: mockWorldCitiesData as AnySuccessfulResponse,
  [PARIS_LANDMARKS_MOCK_DATA_PATH]:
    mockParisLandmarksData as AnySuccessfulResponse,
  [NATIONAL_PARKS_MOCK_DATA_PATH]:
    mockNationalParksData as AnySuccessfulResponse,
  [SPACE_LAUNCH_SITES_MOCK_DATA_PATH]:
    mockSpaceLaunchSitesData as AnySuccessfulResponse,
}

/**
 * Separator used to build a stable key out of the list of URLs
 */
const URLS_KEY_SEPARATOR = '\n'

interface DatasetState {
  loading: boolean
  error: string | null
  title?: string
  records: CustomRecord[]
  metadata: Metadata
  config: Config
  layers: Layer[]
}

export interface DatasetOption {
  url: string
  label: string
}

const EMPTY_DATASET: DatasetState = {
  loading: false,
  error: null,
  records: [],
  metadata: '',
  config: DEFAULT_CONFIG,
  layers: [],
}

const isURLAllowed = (urlToTest: string): boolean => {
  return ALLOWED_API_URL_PATTERNS.some((pattern) => pattern.test(urlToTest))
}

const toDatasetState = (response: AnySuccessfulResponse): DatasetState => {
  const { title, metadata, config, layers } = processApiResponse(response)
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

  return {
    loading: false,
    error: null,
    title,
    records: allRecords,
    metadata,
    config,
    layers: normalizedLayers,
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
  const reloadControllerRef = useRef<AbortController | null>(null)

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
      const mockDataset = MOCK_DATASETS[url]
      if (mockDataset) {
        updateDataset(url, toDatasetState(mockDataset))
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
    const controller = new AbortController()

    for (const url of new Set(stableUrls)) {
      loadDataset(url, controller.signal)
    }

    return () => controller.abort()
  }, [stableUrls, loadDataset])

  useEffect(() => () => reloadControllerRef.current?.abort(), [])

  /**
   * Manually refreshes the selected dataset only
   */
  const reload = useCallback(() => {
    if (!selectedUrl) return

    reloadControllerRef.current?.abort()
    const controller = new AbortController()
    reloadControllerRef.current = controller

    loadDataset(selectedUrl, controller.signal)
  }, [selectedUrl, loadDataset])

  const filteredRecords = useMemo((): CustomRecord[] => {
    const { records } = selectedDataset
    if (!search) return records

    return records.filter((record) => {
      const descriptionText = Array.isArray(record.description)
        ? record.description.join(' ')
        : record.description || ''

      const searchableText = `${record.title} ${descriptionText}`
      return fuzzyMatch(searchableText, search)
    })
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
    reload,
  }
}

export default useFetchData
