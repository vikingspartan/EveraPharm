import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_CLIENT') private redis: Redis,
    private configService: ConfigService,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value)
      const defaultTtl = this.configService.get('cache.ttl.default')
      
      if (ttl || defaultTtl) {
        await this.redis.setex(key, ttl || defaultTtl, stringValue)
      } else {
        await this.redis.set(key, stringValue)
      }
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error)
    }
  }

  async del(key: string | string[]): Promise<void> {
    try {
      if (Array.isArray(key)) {
        await this.redis.del(...key)
      } else {
        await this.redis.del(key)
      }
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error)
    }
  }

  async flush(): Promise<void> {
    try {
      await this.redis.flushdb()
    } catch (error) {
      console.error('Cache flush error:', error)
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern)
    } catch (error) {
      console.error(`Cache keys error for pattern ${pattern}:`, error)
      return []
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.keys(pattern)
      if (keys.length > 0) {
        await this.del(keys)
      }
    } catch (error) {
      console.error(`Cache invalidate pattern error for ${pattern}:`, error)
    }
  }
}