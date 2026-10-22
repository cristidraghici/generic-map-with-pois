import { Metadata } from '@/types'

/**
 * Determines the label of a dataset, in order of priority:
 * the optional `title`, the first `metadata` entry, then the source URL
 */
const getDatasetLabel = (
  url: string,
  title?: string,
  metadata?: Metadata,
): string => {
  const firstMetadata = Array.isArray(metadata) ? metadata[0] : metadata
  return title?.trim() || firstMetadata?.trim() || url
}

export default getDatasetLabel
