type CacheEntry<T> = {
  value: T;
  expiry: number;
};

export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 3600 * 1000; // 1 hour

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    const expiry = Date.now() + (ttlMs || this.defaultTTL);
    this.cache.set(key, { value, expiry });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async flush(): Promise<void> {
    this.cache.clear();
  }
}

// Export singleton instance
export const cacheService = new CacheService();
