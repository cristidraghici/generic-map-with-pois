class IconCache {
  private cache = new Map<string, L.DivIcon>()
  private maxSize: number

  constructor(maxSize = 500) {
    this.maxSize = maxSize
  }

  get(key: string): L.DivIcon | undefined {
    const icon = this.cache.get(key)
    if (icon) {
      this.cache.delete(key)
      this.cache.set(key, icon)
    }
    return icon
  }

  set(key: string, icon: L.DivIcon) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(key, icon)
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

export const iconCacheManager = new IconCache()
