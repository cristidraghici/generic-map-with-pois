import { useCallback, useEffect, useState } from 'react'

type URLParams = { [key: string]: string }
type URLListParams = { [key: string]: string[] }
type URLParamUpdates = { [key: string]: string | null }

/**
 * Normalizes array-style keys, e.g. `api[]` -> `api`
 */
const normalizeKey = (key: string): string => key.replace(/\[\]$/, '')

const parseQueryString = (
  queryString: string,
): { params: URLParams; listParams: URLListParams } => {
  const params: URLParams = {}
  const listParams: URLListParams = {}
  const query = new URLSearchParams(queryString)
  query.forEach((value, rawKey) => {
    const key = normalizeKey(rawKey)
    if (!(key in params)) {
      params[key] = value
    }
    listParams[key] = [...(listParams[key] ?? []), value]
  })
  return { params, listParams }
}

/**
 * Rebuilds the query string, changing only the updated keys and keeping
 * the other segments untouched (e.g. `api[]=/file.json` stays readable)
 */
const buildQueryString = (
  queryString: string,
  updates: URLParamUpdates,
): string => {
  const updatedKeys = Object.keys(updates)
  const preservedSegments = queryString
    .split('&')
    .filter((segment) => segment.length > 0)
    .filter((segment) => {
      const [rawKey = ''] = segment.split('=')
      try {
        return !updatedKeys.includes(normalizeKey(decodeURIComponent(rawKey)))
      } catch {
        return true
      }
    })

  const updatedSegments = Object.entries(updates)
    .filter((entry): entry is [string, string] => entry[1] !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )

  return [...preservedSegments, ...updatedSegments].join('&')
}

const useURLParams = () => {
  const [params, setParams] = useState<URLParams>({})
  const [listParams, setListParams] = useState<URLListParams>({})

  const handleURLChange = useCallback(() => {
    try {
      const url = new URL(window.location.href)
      const queryString = url.search.substring(1) // Remove leading '?'
      const parsed = parseQueryString(queryString)
      setParams(parsed.params)
      setListParams(parsed.listParams)
    } catch (error) {
      console.error('Error updating URL parameters:', error)
      setParams({})
      setListParams({})
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    handleURLChange()
    window.addEventListener('popstate', handleURLChange)

    return () => {
      window.removeEventListener('popstate', handleURLChange)
    }
  }, [handleURLChange])

  /**
   * Updates (or removes, when `null`) single-value URL params without reloading the page
   */
  const updateParams = useCallback(
    (updates: URLParamUpdates) => {
      if (typeof window === 'undefined') {
        return
      }

      try {
        const url = new URL(window.location.href)
        const queryString = buildQueryString(url.search.substring(1), updates)
        const nextUrl = `${url.pathname}${queryString ? `?${queryString}` : ''}${url.hash}`
        window.history.replaceState(window.history.state, '', nextUrl)
        handleURLChange()
      } catch (error) {
        console.error('Error setting URL parameters:', error)
      }
    },
    [handleURLChange],
  )

  return { params, listParams, updateParams }
}

export default useURLParams
