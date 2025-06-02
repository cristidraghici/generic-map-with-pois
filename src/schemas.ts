import z from 'zod'

export const customMarkerSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  title: z.string(),
  description: z.union([z.string(), z.string().array()]).optional(),
})

export const metadataSchema = z.union([z.string(), z.string().array()])

export const customMarkerWithMetadataSchema = z.object({
  metadata: metadataSchema,
  records: customMarkerSchema.array(),
})
