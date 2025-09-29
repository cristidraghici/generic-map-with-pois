import { ComponentProps, FunctionComponent, useState } from 'react'
import { generateShareableUrl } from '@/utils/generateShareableUrl'

interface ShareableLinkProps extends ComponentProps<'div'> {
  id: string
}

export const ShareableLink: FunctionComponent<ShareableLinkProps> = ({
  id,
}) => {
  const [copySuccess, setCopySuccess] = useState(false)

  return (
    <div className="mt-4 pt-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">
          Share this location:
        </span>
        <button
          onClick={async () => {
            const shareableUrl = generateShareableUrl(id)
            try {
              await navigator.clipboard.writeText(shareableUrl)
              setCopySuccess(true)
              setTimeout(() => setCopySuccess(false), 2000)
            } catch (error) {
              console.error('Failed to copy URL:', error)
              // Fallback: try to select the text for manual copying
              const textArea = document.createElement('textarea')
              textArea.value = shareableUrl
              document.body.appendChild(textArea)
              textArea.select()
              try {
                document.execCommand('copy')
                setCopySuccess(true)
                setTimeout(() => setCopySuccess(false), 2000)
              } catch (fallbackError) {
                console.error('Fallback copy failed:', fallbackError)
              }
              document.body.removeChild(textArea)
            }
          }}
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          {copySuccess ? (
            <>
              <svg
                className="mr-1.5 h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="mr-1.5 h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>
      <div className="mt-2">
        <input
          type="text"
          value={generateShareableUrl(id)}
          readOnly
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 focus:border-blue-500 focus:outline-none"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
      </div>
    </div>
  )
}
