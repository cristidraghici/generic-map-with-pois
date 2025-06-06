import { z } from 'zod'
import {
  customMarkerSchema,
  metadataSchema,
  customMarkerWithMetadataSchema,
  configSchema,
} from './schemas'

export type CustomMarker = z.infer<typeof customMarkerSchema>
export type Metadata = z.infer<typeof metadataSchema>
export type Config = z.infer<typeof configSchema>
export type CustomMarkerWithMetadata = z.infer<
  typeof customMarkerWithMetadataSchema
>
