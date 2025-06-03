import React from 'react'

export function linkifyText(text: string): React.ReactNode {
  if (!text) return null

  const urlRegex = /(https?:\/\/[^\s]+)/g
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
  const combinedRegex = new RegExp(
    `${urlRegex.source}|${emailRegex.source}`,
    'g',
  )

  const parts = text.split(combinedRegex).filter(Boolean)

  return parts.map((part, index) => {
    const str = String(part)

    if (str.match(urlRegex)) {
      return (
        <a
          key={index}
          href={str}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {str}
        </a>
      )
    }

    if (str.match(emailRegex)) {
      return (
        <a
          key={index}
          href={`mailto:${str}`}
          className="text-blue-600 underline"
        >
          {str}
        </a>
      )
    }

    return <React.Fragment key={index}>{str}</React.Fragment>
  })
}
