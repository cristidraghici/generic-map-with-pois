import { DEFAULT_CONFIG } from '@/constants'
import {
  AnySuccessfulResponse,
  Config,
  CustomRecord,
  Layer,
  LayerResponse,
  Metadata,
} from '@/types'

export interface ProcessedApiResponse {
  title?: string
  metadata: Metadata
  config: Config
  records: CustomRecord[]
  layers: Layer[]
}

const isLayerItem = (item: unknown): boolean => {
  if (Array.isArray(item)) return true
  if (typeof item === 'object' && item !== null && 'records' in item)
    return true
  return false
}

const processApiResponse = (
  response: AnySuccessfulResponse,
): ProcessedApiResponse => {
  if (Array.isArray(response)) {
    if (response.length === 0) {
      return {
        title: undefined,
        metadata: '',
        config: DEFAULT_CONFIG,
        records: [],
        layers: [],
      }
    }

    const isMultiLayer = isLayerItem(response[0])

    if (isMultiLayer) {
      const layers: Layer[] = (response as LayerResponse[]).map(
        (item, index) => {
          const layerId = `layer-${index}`
          if (Array.isArray(item)) {
            const records = item.map((record) => ({ ...record, layerId }))
            return {
              id: layerId,
              title: `Layer ${index + 1}`,
              metadata: '',
              records,
            }
          }

          const records = (item.records || []).map((record) => ({
            ...record,
            layerId,
          }))

          return {
            id: layerId,
            title: item.title?.trim() || `Layer ${index + 1}`,
            metadata: item.metadata || '',
            records,
            config: item.config,
          }
        },
      )

      const firstLayerWithConfig = layers.find((l) => l.config)
      const mergedConfig = {
        ...DEFAULT_CONFIG,
        ...(firstLayerWithConfig?.config || {}),
      }

      const combinedMetadata: string[] = []
      for (const layer of layers) {
        if (!layer.metadata) continue
        if (Array.isArray(layer.metadata)) {
          combinedMetadata.push(...layer.metadata)
        } else if (
          typeof layer.metadata === 'string' &&
          layer.metadata.trim()
        ) {
          combinedMetadata.push(layer.metadata)
        }
      }

      const allRecords = layers.flatMap((layer) => layer.records)

      return {
        title: layers[0]?.title,
        metadata: combinedMetadata.length > 0 ? combinedMetadata : '',
        config: mergedConfig,
        records: allRecords,
        layers,
      }
    }

    const layerId = 'layer-0'
    const records = (response as CustomRecord[]).map((record) => ({
      ...record,
      layerId,
    }))
    const singleLayer: Layer = {
      id: layerId,
      title: 'Layer 1',
      metadata: '',
      records,
    }

    return {
      title: undefined,
      metadata: '',
      config: DEFAULT_CONFIG,
      records,
      layers: [singleLayer],
    }
  }

  if (
    typeof response === 'object' &&
    response !== null &&
    'records' in response
  ) {
    const layerId = 'layer-0'
    const records = (response.records || []).map((record) => ({
      ...record,
      layerId,
    }))

    const singleLayer: Layer = {
      id: layerId,
      title: response.title?.trim() || 'Layer 1',
      metadata: response.metadata || '',
      records,
      config: response.config,
    }

    return {
      title: response.title,
      metadata: response.metadata || '',
      config: { ...DEFAULT_CONFIG, ...response.config },
      records,
      layers: [singleLayer],
    }
  }

  return {
    title: undefined,
    metadata: '',
    config: DEFAULT_CONFIG,
    records: [],
    layers: [],
  }
}

export default processApiResponse
