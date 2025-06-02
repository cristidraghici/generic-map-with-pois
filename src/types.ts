import { z } from 'zod'
import {
  customMarkerSchema,
  metadataSchema,
  customMarkerWithMetadataSchema,
} from './schemas'

export type CustomMarker = z.infer<typeof customMarkerSchema>
export type Metadata = z.infer<typeof metadataSchema>
export type CustomMarkerWithMetadata = z.infer<
  typeof customMarkerWithMetadataSchema
>
