import { ALLOWED_API_URL_PATTERNS } from '@/constants'
import { runtimeConfigSchema } from '@/schemas'
import { RuntimeConfig } from '@/types'

const EMPTY_RUNTIME_CONFIG: RuntimeConfig = {
  allowedApiOrigins: [],
  allowedApiPatterns: [],
}

const RESERVED_JSON_FILENAMES = new Set([
  'config.json',
  'config.example.json',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'biome.json',
  '.lintstagedrc.json',
])

let runtimeConfigPromise: Promise<RuntimeConfig> | null = null

/**
 * Loads the optional runtime `config.json` from the public root.
 * Silently resolves to an empty config if the file is missing or invalid.
 */
export const loadRuntimeConfig = (): Promise<RuntimeConfig> => {
  if (runtimeConfigPromise) {
    return runtimeConfigPromise
  }

  const baseUrl = import.meta.env.BASE_URL || '/'
  const configUrl = `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}config.json`

  runtimeConfigPromise = fetch(configUrl, { credentials: 'omit' })
    .then(async (response) => {
      if (!response.ok) {
        return EMPTY_RUNTIME_CONFIG
      }
      const json = await response.json()
      const parsed = runtimeConfigSchema.safeParse(json)
      return parsed.success ? parsed.data : EMPTY_RUNTIME_CONFIG
    })
    .catch(() => EMPTY_RUNTIME_CONFIG)

  return runtimeConfigPromise
}

/**
 * Verifies that a same-origin URL points to a public `.json` dataset file
 * and not a hidden dotfile, path-traversal sequence, or reserved config file.
 */
const isSafeSameOriginJsonPath = (
  rawInput: string,
  candidateUrl: URL,
): boolean => {
  // Reject explicit parent-directory traversal in raw input
  if (/(?:^|[\\/])\.\.(?:[\\/?#]|$)/.test(rawInput)) {
    return false
  }

  let decodedPathname: string
  try {
    decodedPathname = decodeURIComponent(candidateUrl.pathname)
  } catch {
    return false
  }

  if (!decodedPathname.toLowerCase().endsWith('.json')) {
    return false
  }

  const segments = decodedPathname.split('/').filter(Boolean)
  if (segments.length === 0) {
    return false
  }

  // Block hidden dot-files or dot-directories (e.g. /.env, /.git/, /.. )
  if (segments.some((segment) => segment.startsWith('.'))) {
    return false
  }

  const fileName = segments[segments.length - 1].toLowerCase()
  if (RESERVED_JSON_FILENAMES.has(fileName)) {
    return false
  }

  return true
}

type OriginLike = {
  isSameOrigin: (_other: OriginLike) => boolean
}

type GlobalWithOrigin = typeof globalThis & {
  Origin?: {
    from: (_value: unknown) => OriginLike
  }
}

/**
 * Compares two URLs or origins for exact same-origin equality using the
 * standard `Origin` API when supported, falling back to `URL.origin`.
 */
export const isSameOriginWith = (
  candidateUrl: URL,
  trustedTarget: URL | Window,
): boolean => {
  try {
    const globalObj = globalThis as GlobalWithOrigin
    if ('Origin' in globalObj && typeof globalObj.Origin?.from === 'function') {
      const candidateOrigin = globalObj.Origin.from(candidateUrl)
      const trustedOrigin = globalObj.Origin.from(trustedTarget)
      return candidateOrigin.isSameOrigin(trustedOrigin)
    }

    const trustedOriginStr =
      trustedTarget instanceof URL
        ? trustedTarget.origin
        : trustedTarget.location.origin

    return (
      candidateUrl.origin !== 'null' &&
      trustedOriginStr !== 'null' &&
      candidateUrl.origin === trustedOriginStr
    )
  } catch {
    return false
  }
}

/**
 * Validates whether an API URL is allowed:
 * 1. Resolves relative URLs (e.g. `all.json`, `/data/pois.json`) against `window.location.href`.
 * 2. Automatically allows any same-origin URL hosted on the current deployment domain.
 * 3. Checks `ALLOWED_API_URL_PATTERNS` in `src/constants.ts`.
 * 4. Checks `allowedApiOrigins` and `allowedApiPatterns` from optional runtime `config.json`.
 */
export const isApiUrlAllowed = (
  urlToTest: string,
  runtimeConfig: RuntimeConfig = EMPTY_RUNTIME_CONFIG,
): boolean => {
  const trimmed = urlToTest.trim()
  if (!trimmed) return false

  let candidateUrl: URL
  try {
    const baseHref =
      typeof window !== 'undefined' ? window.location.href : 'http://localhost/'
    candidateUrl = new URL(trimmed, baseHref)
  } catch {
    return false
  }

  // Only allow HTTP(S) protocols without embedded credentials
  if (candidateUrl.protocol !== 'http:' && candidateUrl.protocol !== 'https:') {
    return false
  }
  if (candidateUrl.username || candidateUrl.password) {
    return false
  }

  // 1. Same-origin `.json` dataset URLs (e.g. `?api=all.json` on the current host)
  if (
    typeof window !== 'undefined' &&
    isSameOriginWith(candidateUrl, window) &&
    isSafeSameOriginJsonPath(trimmed, candidateUrl)
  ) {
    return true
  }

  // 2. Built-in ALLOWED_API_URL_PATTERNS in constants.ts
  if (
    ALLOWED_API_URL_PATTERNS.some(
      (pattern) => pattern.test(trimmed) || pattern.test(candidateUrl.href),
    )
  ) {
    return true
  }

  // 3. Runtime config: allowedApiOrigins
  if (runtimeConfig.allowedApiOrigins) {
    for (const originEntry of runtimeConfig.allowedApiOrigins) {
      try {
        const trustedUrl = new URL(originEntry)
        if (isSameOriginWith(candidateUrl, trustedUrl)) {
          return true
        }
      } catch {
        // Ignore malformed origin entries in runtime config
      }
    }
  }

  // 4. Runtime config: allowedApiPatterns
  if (runtimeConfig.allowedApiPatterns) {
    for (const patternStr of runtimeConfig.allowedApiPatterns) {
      try {
        const regex = new RegExp(patternStr, 'i')
        if (regex.test(trimmed) || regex.test(candidateUrl.href)) {
          return true
        }
      } catch {
        // Ignore invalid regex patterns in runtime config
      }
    }
  }

  return false
}
