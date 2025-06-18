class IconCache {
  private cache = new Map<string, L.DivIcon>()
  private maxSize: number

  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }

  get(key: string): L.DivIcon | undefined {
    return this.cache.get(key)
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
}

export const iconCacheManager = new IconCache()
