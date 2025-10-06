import { FunctionComponent, useState } from 'react'
import html2pdf from 'html2pdf.js'
import { ReactComponent as IconDownloadSVG } from '@/assets/icons/download.svg'
import { sanitizeFileName } from '@/utils/files'

interface DownloadPDFButtonProps {
  selector: string
  name?: string
  onBeforeGenerate?: () => void
  onAfterGenerate?: () => void
  togglePageBreakBeforeMediaInPDF?: () => void
  isPageBreakBeforeMediaInPDFEnabled?: boolean
}

export const DownloadPDFButton: FunctionComponent<DownloadPDFButtonProps> = ({
  selector,
  name = 'pdf-document',
  onBeforeGenerate,
  onAfterGenerate,
  togglePageBreakBeforeMediaInPDF,
  isPageBreakBeforeMediaInPDFEnabled = false,
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
        filename: `${sanitizeFileName(name)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait' as const,
          compress: true,
          putOnlyUsedFonts: true,
          floatPrecision: 16,
        },
        pagebreak: {
          mode: ['css', 'legacy'],
          before: '.pdf-page-break-before',
          after: '.pdf-page-break-after',
          avoid: '.pdf-page-break-avoid',
        },
      }

      if (onBeforeGenerate) {
        onBeforeGenerate()

        // Wait a moment to ensure any UI updates are rendered
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      await html2pdf().set(options).from(element).save()

      // Wait a moment to ensure the PDF has been fully processed
      await new Promise((resolve) => setTimeout(resolve, 100))

      if (onAfterGenerate) {
        onAfterGenerate()
      }

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
    <>
      <div className="flex items-center justify-between gap-2 rounded-lg pt-4 transition">
        <label
          htmlFor="page-break-before-media-toggle"
          className="select-none text-sm font-medium text-gray-600"
        >
          Page break before media
        </label>

        <input
          type="checkbox"
          id="page-break-before-media-toggle"
          className="h-4 w-8 cursor-pointer appearance-none rounded-full bg-gray-300 transition-colors before:absolute before:h-4 before:w-4 before:translate-x-0 before:rounded-full before:bg-white before:shadow before:transition-transform checked:bg-green-600 checked:before:translate-x-4"
          style={{ position: 'relative' }}
          onChange={() => {
            if (typeof togglePageBreakBeforeMediaInPDF === 'function') {
              togglePageBreakBeforeMediaInPDF()
            }
          }}
          checked={!!isPageBreakBeforeMediaInPDFEnabled}
          disabled={isGenerating}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={downloadPDF}
          disabled={isGenerating}
          className={`mt-4 inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1`}
        >
          <IconDownloadSVG className="mr-1.5 h-3 w-3" /> Download PDF
        </button>
      </div>
    </>
  )
}

export default DownloadPDFButton
