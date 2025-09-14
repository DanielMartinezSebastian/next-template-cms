import { CacheLayer } from '@/types/translations';

interface CacheItem<T> {
  value: T;
  expires: number;
  size: number;
}

export class MemoryCache implements CacheLayer {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize: number;
  private defaultTtl: number;
  private currentSize = 0;

  constructor(maxSize = 100 * 1024 * 1024, defaultTtl = 300) { // 100MB default
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtl;
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      this.currentSize -= item.size;
      return null;
    }

    return item.value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expires = Date.now() + (ttl || this.defaultTtl) * 1000;
    const size = this.estimateSize(value);
    
    // Remove old value if exists
    const existing = this.cache.get(key);
    if (existing) {
      this.currentSize -= existing.size;
    }

    // Evict if necessary
    while (this.currentSize + size > this.maxSize && this.cache.size > 0) {
      this.evictLRU();
    }

    this.cache.set(key, { value, expires, size });
    this.currentSize += size;
  }

  async del(key: string): Promise<void> {
    const item = this.cache.get(key);
    if (item) {
      this.cache.delete(key);
      this.currentSize -= item.size;
    }
  }

  async clear(pattern?: string): Promise<void> {
    if (!pattern) {
      this.cache.clear();
      this.currentSize = 0;
      return;
    }

    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const [key, item] of this.cache.entries()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        this.currentSize -= item.size;
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      this.currentSize -= item.size;
      return false;
    }
    
    return true;
  }

  // Cache management methods
  getStats() {
    return {
      size: this.cache.size,
      memoryUsage: this.currentSize,
      maxSize: this.maxSize,
      utilizationRate: this.currentSize / this.maxSize
    };
  }

  private evictLRU(): void {
    // Simple FIFO for now, can be enhanced to true LRU
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      const item = this.cache.get(firstKey)!;
      this.cache.delete(firstKey);
      this.currentSize -= item.size;
    }
  }

  private estimateSize(value: any): number {
    // Rough estimation of object size in bytes
    return JSON.stringify(value).length * 2; // UTF-16 chars are 2 bytes
  }
}
