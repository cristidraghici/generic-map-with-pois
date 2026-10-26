let prevBuffer = new Uint16Array(256)
let currBuffer = new Uint16Array(256)

/**
 * Compute the Levenshtein distance between two strings.
 * Supports an optional `maxDistance` threshold for O(1) length-difference
 * bailout and early row termination, reusing typed array buffers.
 */
export default function levenshtein(
  a: string,
  b: string,
  maxDistance?: number,
): number {
  const la = a.length
  const lb = b.length

  if (maxDistance !== undefined && Math.abs(la - lb) > maxDistance) {
    return maxDistance + 1
  }

  if (la === 0) return lb
  if (lb === 0) return la

  // ensure a is the shorter string to use less memory
  if (la > lb) return levenshtein(b, a, maxDistance)

  if (la + 1 > prevBuffer.length) {
    const nextSize = Math.max(la + 1, prevBuffer.length * 2)
    prevBuffer = new Uint16Array(nextSize)
    currBuffer = new Uint16Array(nextSize)
  }

  let prev = prevBuffer
  let curr = currBuffer

  for (let i = 0; i <= la; i++) prev[i] = i

  for (let j = 1; j <= lb; j++) {
    curr[0] = j
    let rowMin = j
    const bj = b.charCodeAt(j - 1)
    for (let i = 1; i <= la; i++) {
      const cost = a.charCodeAt(i - 1) === bj ? 0 : 1
      const deletion = prev[i] + 1
      const insertion = curr[i - 1] + 1
      const substitution = prev[i - 1] + cost
      const cell = Math.min(deletion, insertion, substitution)
      curr[i] = cell
      if (cell < rowMin) {
        rowMin = cell
      }
    }
    if (maxDistance !== undefined && rowMin > maxDistance) {
      return maxDistance + 1
    }
    ;[prev, curr] = [curr, prev]
  }

  return prev[la]
}
