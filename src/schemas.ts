import z from 'zod'

export const customRecordSchema = z.object({
  id: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  title: z.string(),
  description: z.union([z.string(), z.string().array()]).optional(),
  images: z.string().array().optional(),
})

export const metadataSchema = z.union([z.string(), z.string().array()])

export const configSchema = z.object({
  typeOfIcon: z.enum(['default', 'dot', 'text']),
  isListVisible: z.boolean().optional(),
  zoomOnSelect: z.boolean().optional(),
  isListFilteredToViewport: z.boolean().optional(),
})

export const customRecordWithMetadataSchema = z.object({
  metadata: metadataSchema,
  records: customRecordSchema.array(),
  config: configSchema.optional(),
})

export const anySuccessfulResponseSchema = z.union([
  customRecordSchema.array(),
  customRecordWithMetadataSchema,
])
