const throttle = <T extends (..._args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number,
): ((..._args: Parameters<T>) => void) => {
  let lastCall = 0
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>): void => {
    const now = Date.now()
    const remaining = delay - (now - lastCall)

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      lastCall = now
      func(...args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now()
        timeout = null
        func(...args)
      }, remaining)
    }
  }
}

export default throttle
