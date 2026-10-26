import { FUZZY_SEARCH_CONFIG } from '@/constants'
import levenshtein from './levenshtein'

/**
 * Computes the maximum allowed Levenshtein distance for a normalized query string
 */
export function getMaxFuzzyDistance(queryLength: number): number {
  const maxAbs = FUZZY_SEARCH_CONFIG.maxDistance
  if (!FUZZY_SEARCH_CONFIG.useRelative || queryLength === 0) {
    return maxAbs
  }
  return Math.max(
    maxAbs,
    Math.floor(FUZZY_SEARCH_CONFIG.maxRelativeDistance * queryLength),
  )
}

/**
 * Fast fuzzy match using pre-normalized lowercase text and pre-split tokens
 */
export function fuzzyMatchIndexed(
  normalizedText: string,
  tokens: readonly string[],
  normalizedQuery: string,
  maxAllowedDistance: number,
): boolean {
  if (!normalizedQuery) return true

  // fast path: exact substring
  if (normalizedText.includes(normalizedQuery)) return true

  if (!FUZZY_SEARCH_CONFIG.enabled) return false

  for (let i = 0; i < tokens.length; i++) {
    const d = levenshtein(tokens[i], normalizedQuery, maxAllowedDistance)
    if (d <= maxAllowedDistance) return true
  }

  return false
}

/**
 * Returns true if `text` fuzzily matches `query` according to config.
 * It will return true if exact substring match exists or if Levenshtein distance
 * between query and any token in text is within allowed thresholds.
 */
export default function fuzzyMatch(
  text: string,
  query: string,
  isCaseSensitive: boolean = false,
): boolean {
  if (!query) return true
  const q = isCaseSensitive ? query.trim() : query.trim().toLowerCase()
  if (!q) return true
  const t = isCaseSensitive ? text.trim() : text.toLowerCase()

  const tokens = t.split(/\s+/).filter(Boolean)
  const maxAllowedDistance = getMaxFuzzyDistance(q.length)

  return fuzzyMatchIndexed(t, tokens, q, maxAllowedDistance)
}
