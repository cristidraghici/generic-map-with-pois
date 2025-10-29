import levenshtein from './levenshtein'
import { FUZZY_SEARCH_CONFIG } from '@/constants'

/**
 * Returns true if `text` fuzzily matches `query` according to config.
 * It will return true if exact substring match exists or if Levenshtein distance
 * between query and any token in text is within allowed thresholds.
 */
export default function fuzzyMatch(
  text: string,
  query: string,
  isCaseSensitive: boolean = true,
): boolean {
  if (!query) return true
  const q = isCaseSensitive ? query.trim().toLowerCase() : query.trim()
  const t = isCaseSensitive ? text.toLowerCase() : text.trim()

  // fast path: exact substring
  if (t.includes(q)) return true

  if (!FUZZY_SEARCH_CONFIG.enabled) return false

  const maxAbs = FUZZY_SEARCH_CONFIG.maxDistance
  const useRel = FUZZY_SEARCH_CONFIG.useRelative
  const maxRel = FUZZY_SEARCH_CONFIG.maxRelativeDistance

  const tokens = t.split(/\s+/).filter(Boolean)

  for (const token of tokens) {
    // try measuring distance against the whole token
    const d = levenshtein(token, q)
    if (d <= maxAbs) return true

    if (useRel && q.length > 0) {
      const rel = d / q.length
      if (rel <= maxRel) return true
    }
  }

  return false
}
