import React from 'react'

const URL_PATTERN = 'https?:\\/\\/[^\\s]+'
const EMAIL_PATTERN = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'

const COMBINED_SPLIT_REGEX = new RegExp(
  `(${URL_PATTERN}|${EMAIL_PATTERN})`,
  'g',
)
const URL_TEST_REGEX = new RegExp(`^${URL_PATTERN}$`)
const EMAIL_TEST_REGEX = new RegExp(`^${EMAIL_PATTERN}$`)

export function linkifyText(text: string): React.ReactNode {
  if (!text) return null

  const parts = text.split(COMBINED_SPLIT_REGEX).filter(Boolean)

  return parts.map((part, index) => {
    const str = String(part)

    if (URL_TEST_REGEX.test(str)) {
      return (
        <a
          key={index}
          href={str}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded text-blue-600 underline transition-colors hover:text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {str}
        </a>
      )
    }

    if (EMAIL_TEST_REGEX.test(str)) {
      return (
        <a
          key={index}
          href={`mailto:${str}`}
          className="rounded text-blue-600 underline transition-colors hover:text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {str}
        </a>
      )
    }

    return <React.Fragment key={index}>{str}</React.Fragment>
  })
}
