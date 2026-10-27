import type { z } from 'zod'
import {
  activeFiltersSchema,
  anySuccessfulResponseSchema,
  configSchema,
  customRecordSchema,
  customRecordWithMetadataSchema,
  filterCheckboxValueSchema,
  filterDefinitionSchema,
  filterOptionSchema,
  filterRangeValueSchema,
  filterSelectValueSchema,
  filterTypeSchema,
  filterValueSchema,
  layerResponseSchema,
  layerSchema,
  metadataSchema,
  multiLayerResponseSchema,
  recordIdSchema,
  runtimeConfigSchema,
} from './schemas'

export type RecordId = z.infer<typeof recordIdSchema>
export type CustomRecord = z.infer<typeof customRecordSchema>
export type Metadata = z.infer<typeof metadataSchema>
export type Config = z.infer<typeof configSchema>
export type FilterOption = z.infer<typeof filterOptionSchema>
export type FilterType = z.infer<typeof filterTypeSchema>
export type FilterDefinition = z.infer<typeof filterDefinitionSchema>
export type FilterRangeValue = z.infer<typeof filterRangeValueSchema>
export type FilterCheckboxValue = z.infer<typeof filterCheckboxValueSchema>
export type FilterSelectValue = z.infer<typeof filterSelectValueSchema>
export type FilterValue = z.infer<typeof filterValueSchema>
export type ActiveFilters = z.infer<typeof activeFiltersSchema>
export type CustomRecordWithMetadata = z.infer<
  typeof customRecordWithMetadataSchema
>
export type Layer = z.infer<typeof layerSchema>
export type LayerResponse = z.infer<typeof layerResponseSchema>
export type MultiLayerResponse = z.infer<typeof multiLayerResponseSchema>
export type AnySuccessfulResponse = z.infer<typeof anySuccessfulResponseSchema>
export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>
