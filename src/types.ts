import { z } from 'zod'
import {
  anySuccessfulResponseSchema,
  configSchema,
  customRecordSchema,
  customRecordWithMetadataSchema,
  metadataSchema,
} from './schemas'

export type CustomRecord = z.infer<typeof customRecordSchema>
export type Metadata = z.infer<typeof metadataSchema>
export type Config = z.infer<typeof configSchema>
export type CustomRecordWithMetadata = z.infer<
  typeof customRecordWithMetadataSchema
>

export type AnySuccessfulResponse = z.infer<typeof anySuccessfulResponseSchema>
