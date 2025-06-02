import { useState, useEffect } from 'react'

type URLParams = { [key: string]: string }

function parseQueryString(queryString: string): URLParams {
  try {
    const params: URLParams = {}
    const query = new URLSearchParams(queryString)
    query.forEach((value, key) => {
      params[key] = value
    })
    return params
  } catch (error) {
    console.error('Error parsing URL parameters:', error)
    return {}
  }
}

function useURLParams(): URLParams {
  const [params, setParams] = useState<URLParams>({})

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleURLChange = () => {
      try {
        const url = new URL(window.location.href)
        const queryString = url.search.substring(1) // Remove leading '?'
        if (queryString) {
          const parsedParams = parseQueryString(queryString)
          setParams(parsedParams)
        } else {
          setParams({})
        }
      } catch (error) {
        console.error('Error updating URL parameters:', error)
        setParams({})
      }
    }

    handleURLChange()
    window.addEventListener('popstate', handleURLChange)

    return () => {
      window.removeEventListener('popstate', handleURLChange)
    }
  }, [])

  return params
}

export default useURLParams
