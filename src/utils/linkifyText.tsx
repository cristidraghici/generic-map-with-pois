import React from 'react'

export function linkifyText(text: string): React.ReactNode {
  const regex = /(https?:\/\/[^\s]+)/g

  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (part.match(regex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {part}
        </a>
      )
    } else {
      return <React.Fragment key={index}>{part}</React.Fragment>
    }
  })
}
