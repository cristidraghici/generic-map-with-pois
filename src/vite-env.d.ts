/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >
  const src: string
  export default src
}

declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?:
      | number
      | number[]
      | { top?: number; right?: number; bottom?: number; left?: number }
    filename?: string
    image?: { type?: string; quality?: number }
    enableLinks?: boolean
    html2canvas?: {
      scale?: number
      useCORS?: boolean
      letterRendering?: boolean
    }
    jsPDF?: {
      unit?: string
      format?: string | number[]
      orientation?: 'portrait' | 'landscape'
    }
    pagebreak?: {
      mode?: string[]
      before?: string
      after?: string
      avoid?: string
    }
  }

  interface Html2Pdf {
    set(_options: Html2PdfOptions): Html2Pdf
    from(_element: HTMLElement | string): Html2Pdf
    save(): Promise<void>
    output(_type: string): Promise<Blob>
    outputPdf(): Promise<Blob>
  }

  function html2pdf(): Html2Pdf

  export = html2pdf
}
