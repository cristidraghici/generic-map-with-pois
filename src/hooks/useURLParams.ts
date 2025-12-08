import { useEffect, useState } from 'react'

type URLParams = { [key: string]: string }

const parseQueryString = (queryString: string): URLParams => {
  const params: URLParams = {}
  const query = new URLSearchParams(queryString)
  query.forEach((value, key) => {
    params[key] = value
  })
  return params
}

const useURLParams = (): URLParams => {
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
