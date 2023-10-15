import z from 'zod'

export const customMarkerSchema: z.ZodType<CustomMarker> = z.object({
  latitude: z.number(),
  longitude: z.number(),
  title: z.string(),
  description: z.union([z.string(), z.string().array()]).optional(),
})

export const metadataSchema: z.ZodType<Metadata> = z.union([
  z.string(),
  z.string().array(),
])

export const customMarkerWithMetadataSchema: z.ZodType<CustomMarkerWithMetadata> =
  z.object({
    metadata: metadataSchema,
    records: customMarkerSchema.array(),
  })
