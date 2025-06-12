const debounce = <T extends (..._args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number,
): ((..._args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>): void => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export default debounce
