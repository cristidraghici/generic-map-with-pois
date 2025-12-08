import React, { ComponentProps } from 'react'

type ConditionalElementBaseProps<T extends keyof HTMLElementTagNameMap> = {
  as?: T
  rcIf?: boolean
}

type ConditionalElementProps<T extends keyof HTMLElementTagNameMap> =
  ConditionalElementBaseProps<T> & ComponentProps<T>

const ConditionalElement = <T extends keyof HTMLElementTagNameMap>({
  as,
  children,
  rcIf = true,
  ...props
}: ConditionalElementProps<T>) => {
  if (rcIf === false) {
    return null
  }

  if (as) {
    return React.createElement(as, props as ComponentProps<T>, children)
  }

  return <>{children}</>
}

export default ConditionalElement
