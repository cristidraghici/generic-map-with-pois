import { FunctionComponent, useState } from 'react'
import html2pdf from 'html2pdf.js'
import { ReactComponent as IconDownloadSVG } from '@/assets/icons/download.svg'

export const DownloadPDFButton: FunctionComponent<{ selector: string }> = ({
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
        className={`mt-4 inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1`}
      >
        <IconDownloadSVG className="mr-1.5 h-3 w-3" /> Download PDF
      </button>
    </div>
  )
}

export default DownloadPDFButton
