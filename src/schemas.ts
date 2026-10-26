import z from 'zod'

export const recordIdSchema = z.string().brand('recordId')

export const customRecordSchema = z.object({
  id: recordIdSchema.optional(),
  latitude: z.number(),
  longitude: z.number(),
  title: z.string(),
  description: z.union([z.string(), z.string().array()]).optional(),
  images: z.string().array().optional(),
  color: z.string().optional(),
  layerId: z.string().optional(),
})

export const metadataSchema = z.union([z.string(), z.string().array()])

export const configSchema = z.object({
  typeOfIcon: z.enum(['default', 'dot', 'text']),
  isListEnabled: z.boolean().optional(),
  isZoomOnSelectEnabled: z.boolean().optional(),
  isListFilteredToViewport: z.boolean().optional(),
  isShowOnlyURLRecordEnabled: z.boolean().optional(),
  isAggressiveOptimizationEnabled: z.boolean().optional(),
})

export const customRecordWithMetadataSchema = z.object({
  title: z.string().optional(),
  metadata: metadataSchema.optional(),
  records: customRecordSchema.array(),
  config: configSchema.optional(),
})

export const layerSchema = z.object({
  id: z.string(),
  title: z.string(),
  metadata: metadataSchema.optional(),
  records: customRecordSchema.array(),
  config: configSchema.optional(),
})

export const layerResponseSchema = z.union([
  customRecordWithMetadataSchema,
  customRecordSchema.array(),
])

export const multiLayerResponseSchema = z.array(layerResponseSchema)

export const anySuccessfulResponseSchema = z.union([
  multiLayerResponseSchema,
  customRecordWithMetadataSchema,
  customRecordSchema.array(),
])
