import { z } from 'zod'
import {
  anySuccessfulResponseSchema,
  configSchema,
  customRecordSchema,
  customRecordWithMetadataSchema,
  filterDefinitionSchema,
  filterOptionSchema,
  filterTypeSchema,
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
export type CustomRecordWithMetadata = z.infer<
  typeof customRecordWithMetadataSchema
>
export type Layer = z.infer<typeof layerSchema>
export type LayerResponse = z.infer<typeof layerResponseSchema>
export type MultiLayerResponse = z.infer<typeof multiLayerResponseSchema>
export type AnySuccessfulResponse = z.infer<typeof anySuccessfulResponseSchema>
export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>
