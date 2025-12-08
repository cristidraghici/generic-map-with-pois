/**
 * Extracts the base directory from a JSON file path
 * @param apiUrl - The API URL or file path
 * @returns The base directory path or empty string if not a valid path
 */
const getApiBaseDirectory = (apiUrl: string): string => {
  try {
    // Handle URLs
    if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
      const url = new URL(apiUrl)
      const pathname = url.pathname
      const lastSlashIndex = pathname.lastIndexOf('/')
      return lastSlashIndex > 0
        ? url.origin + pathname.substring(0, lastSlashIndex)
        : url.origin
    }

    // Handle file paths
    const lastSlashIndex = Math.max(
      apiUrl.lastIndexOf('/'),
      apiUrl.lastIndexOf('\\'),
    )
    return lastSlashIndex > 0 ? apiUrl.substring(0, lastSlashIndex) : ''
  } catch {
    return ''
  }
}

/**
 * Recursively processes an object and replaces paths starting with '.' with the base directory
 * @param obj - The object to process
 * @param baseDir - The base directory to use for relative path resolution
 * @returns The processed object with resolved paths
 */
function processObjectPaths<T>(obj: T, baseDir: string): T {
  if (typeof obj === 'string' && obj.startsWith('./')) {
    const relativePath = obj.substring(2) // Remove './'
    return (baseDir
      ? `${baseDir}/${relativePath}`
      : relativePath) as unknown as T
  }

  if (typeof obj === 'string' && obj === '.') {
    return (baseDir || '.') as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => processObjectPaths(item, baseDir)) as unknown as T
  }

  if (obj && typeof obj === 'object') {
    const processedObj: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      processedObj[key] = processObjectPaths(value, baseDir)
    }
    return processedObj as T
  }

  return obj
}

/**
 * Resolves relative paths in JSON data based on the API parameter base directory
 * @param data - The JSON data to process
 * @param apiUrl - The API URL or file path used to determine the base directory
 * @returns The processed data with resolved relative paths
 */
export const resolveRelativePaths = <T>(data: T, apiUrl: string): T => {
  if (!apiUrl || !data) {
    return data
  }

  const baseDir = getApiBaseDirectory(apiUrl)

  if (!baseDir) {
    return data
  }

  return processObjectPaths(data, baseDir)
}

export default resolveRelativePaths
