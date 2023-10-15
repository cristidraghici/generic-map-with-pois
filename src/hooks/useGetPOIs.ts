import { useState, useEffect } from 'react'

import { customMarkerSchema, customMarkerWithMetadataSchema } from '../schemas'

import mockData from '../assets/cities_in_romania.json'

/**
 * List of regular expressions used to whitelist the URL given as a source of POIs.
 * This is a minimal security feature to prevent the most basic abuse.
 */
const ALLOWED_API_URLS: RegExp[] = [
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, // A regex for the Github pages
]

const useGetPOIs = (url?: string) => {
  const [records, setRecords] = useState<CustomMarker[]>([])
  const [metadata, setMetadata] = useState<Metadata>('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [reload, setReload] = useState(0)

  useEffect(() => {
    // No url was provided
    if (!url) {
      return
    }

    // Load the default data
    if (url === '/cities_in_romania.json') {
      setRecords(Array.isArray(mockData) ? mockData : mockData.records)
      setMetadata(!mockData?.metadata ? '' : mockData?.metadata)
      return
    }

    // The provided url does not match the regex values in the whitelist
    if (ALLOWED_API_URLS.every((regex) => !regex.test(url))) {
      setError(
        "The URL provided does not match the safety rules in this project's whitelist.",
      )

      return
    }

    // Fetch the data
    setLoading(true)

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not retrieve the data.')
        }

        return response.json()
      })
      .then((json: CustomMarker[] | CustomMarkerWithMetadata) => {
        const hasMetadata = !Array.isArray(json)

        // has metadata
        if (hasMetadata) {
          const validatedResponse =
            customMarkerWithMetadataSchema.safeParse(json)

          if (!validatedResponse.success) {
            throw new Error('Could not parse the entities in the response.')
          }

          setRecords(validatedResponse.data.records)
          setMetadata(validatedResponse.data.metadata)

          return
        }

        // direct markers
        const validatedResponse = customMarkerSchema.array().safeParse(json)

        if (!validatedResponse.success) {
          throw new Error('Could not parse the entities in the response.')
        }

        setRecords(validatedResponse.data)
        setMetadata('')
      })
      .catch((error) => {
        setError(error?.message || error.toString())
      })
      .finally(() => {
        setLoading(false)
      })
  }, [url, reload])

  return {
    records,
    metadata,
    loading,
    error,
    reload: () => setReload(reload + 1),
  }
}

export default useGetPOIs
