import { DEFAULT_CONFIG } from '@/constants'
import { AnySuccessfulResponse } from '@/types'

const processApiResponse = (response: AnySuccessfulResponse) => {
  const isRecordList = Array.isArray(response)
  const isDataWithMetaAndConfig =
    'metadata' in response && 'config' in response && 'records' in response

  if (isRecordList) {
    return {
      metadata: '',
      config: DEFAULT_CONFIG,
      records: response,
    }
  }

  if (isDataWithMetaAndConfig) {
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
