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

/**
 * We could use z.infer() to remove the code below, since we already define a type in the
 * zod schemas. e.g. `type CustomMarker = z.infer<typeof customMarkerSchema>`. However,
 * we will need to export and import types afterwards, instead of simply having them
 * available from the bundler. We might do this change in the near future.
 */

type CustomMarker = {
  latitude: number
  longitude: number
  title: string
  description?: string | string[]
}

/**
 * Metadata currently only consists of a string or an array of strings
 * containing information about the retrieved records
 */
type Metadata = string | string[]

interface CustomMarkerWithMetadata {
  metadata: Metadata
  records: CustomMarker[]
}
