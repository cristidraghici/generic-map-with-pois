/**
 * Compute the Levenshtein distance between two strings.
 * Time complexity: O(n*m), space O(min(n,m)) if optimized.
 */
export default function levenshtein(a: string, b: string): number {
  const la = a.length
  const lb = b.length
  if (la === 0) return lb
  if (lb === 0) return la

  // ensure a is the shorter string to use less memory
  if (la > lb) return levenshtein(b, a)

  let prev = new Array(la + 1)
  let curr = new Array(la + 1)

  for (let i = 0; i <= la; i++) prev[i] = i

  for (let j = 1; j <= lb; j++) {
    curr[0] = j
    const bj = b.charCodeAt(j - 1)
    for (let i = 1; i <= la; i++) {
      const cost = a.charCodeAt(i - 1) === bj ? 0 : 1
      const deletion = prev[i] + 1
      const insertion = curr[i - 1] + 1
      const substitution = prev[i - 1] + cost
      curr[i] = Math.min(deletion, insertion, substitution)
    }
    ;[prev, curr] = [curr, prev]
  }

  return prev[la]
}
