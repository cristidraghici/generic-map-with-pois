import { DEFAULT_CONFIG } from '@/constants'
import { AnySuccessfulResponse } from '@/types'

const processApiResponse = (response: AnySuccessfulResponse) => {
  if (Array.isArray(response)) {
    return {
      metadata: '',
      config: DEFAULT_CONFIG,
      records: response,
    }
  }

  if ('records' in response) {
    return {
      ...response,
      config: { ...DEFAULT_CONFIG, ...response.config },
    }
  }

  return {
    metadata: '',
    config: DEFAULT_CONFIG,
    records: [],
  }
}

export default processApiResponse
