import { FunctionComponent, useState } from 'react'
import html2pdf from 'html2pdf.js'

export const DownloadButton: FunctionComponent<{ selector: string }> = ({
  selector,
}) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadPDF = async () => {
    setIsGenerating(true)

    try {
      const element = document.querySelector(selector) as HTMLElement
      if (!element) {
        console.error(`Element with selector '${selector}' not found`)
        return
      }

      // Hide action buttons during PDF generation
      const actionButtons = element.querySelectorAll(
        '.RecordDetailsActionButtons',
      )
      const hiddenButtons: HTMLElement[] = []

      actionButtons.forEach((button) => {
        if (button instanceof HTMLDivElement) {
          button.style.display = 'none'
          hiddenButtons.push(button)
        }
      })

      const options = {
        margin: 0.5,
        filename: 'map-with-pois.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait' as const,
        },
        pagebreak: {
          mode: ['css', 'legacy'],
          before: '.pdf-page-break-before',
          after: '.pdf-page-break-after',
          avoid: '.pdf-page-break-avoid',
        },
      }

      await html2pdf().set(options).from(element).save()

      // Show buttons again after PDF generation
      hiddenButtons.forEach((button) => {
        button.style.display = ''
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex justify-end">
      <button
        onClick={downloadPDF}
        disabled={isGenerating}
        className={`mt-4 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          isGenerating
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        }`}
      >
        {isGenerating ? (
          <>
            <svg
              className="mr-1.5 h-3 w-3 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating...
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Download PDF
          </>
        )}
      </button>
    </div>
  )
}

export default DownloadButton
