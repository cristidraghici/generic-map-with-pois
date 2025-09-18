/**
 * Generates a shareable URL with the current page URL and the specified ID parameter
 * @param id - The record ID to append to the URL
 * @returns The complete shareable URL with the ID parameter
 */
export const generateShareableUrl = (id: string): string => {
  if (typeof window === 'undefined') {
    return ''
  }

  if (!id || id.trim() === '') {
    console.warn('generateShareableUrl called with empty or invalid ID')
    return window.location.href
  }

  try {
    const currentUrl = new URL(window.location.href)
    
    // Add or update the id parameter
    currentUrl.searchParams.set('id', id.trim())
    
    return currentUrl.toString()
  } catch (error) {
    console.error('Error generating shareable URL:', error)
    return window.location.href
  }
}
