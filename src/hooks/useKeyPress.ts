import { useEffect } from 'react'

interface KeyPressAction {
  key: string
  action: () => void
}

const useKeyPress = (
  keyActions: KeyPressAction[],
  isActive: boolean = true,
): void => {
  useEffect(() => {
    if (!isActive) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const { key, action } of keyActions) {
        if (event.key === key) {
          action()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, keyActions])
}

export default useKeyPress
