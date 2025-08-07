import type { RaindropAPI } from './raindrop-api'
import type { RaindropCollection, RaindropItem, User } from './raindrop-schemas'
import { db } from './raindrop-db'

export class CachedRaindropAPI {
  private api: RaindropAPI
  private defaultTTL = 5 * 60 * 1000 // 5 минут по умолчанию

  constructor(api: RaindropAPI) {
    this.api = api
  }


  /**
   * Получить данные пользователя с кэшированием
   */
  async getUser(force = false, ttl?: number): Promise<User | null> {
    const effectiveTTL = ttl || this.defaultTTL

    if (!force) {
      const cached = await db.getCachedUser()
      if (cached) {
        return cached
      }
    }

    try {
      const user = await this.api.getUser()

      if (user) {
        await db.cacheUser(user, effectiveTTL)
        await db.recordSync('partial', 'success')
      }

      return user
    }
    catch (error) {
      await db.recordSync('partial', 'failed', error instanceof Error ? error.message : 'Unknown error')

      const cached = await db.getCachedUser()
      if (cached) {
        console.warn('API request failed, returning cached data:', error)
        return cached
      }
      throw error
    }
  }

  /**
   * Получить raindrops для коллекции с кэшированием
   */
  async getRaindrops(
    collectionId: number,
    perpage = 50,
    force = false,
    ttl?: number,
  ): Promise<RaindropItem[]> {
    const effectiveTTL = ttl || this.defaultTTL

    if (!force) {
      const cached = await db.getCachedRaindrops(collectionId)
      if (cached) {
        return cached
      }
    }

    try {
      const raindrops = await this.api.getRaindrops(collectionId, perpage)
      await db.cacheRaindrops(collectionId, raindrops, effectiveTTL)
      await db.recordSync('partial', 'success')
      return raindrops
    }
    catch (error) {
      await db.recordSync('partial', 'failed', error instanceof Error ? error.message : 'Unknown error')

      const cached = await db.getCachedRaindrops(collectionId)
      if (cached) {
        console.warn('API request failed, returning cached data:', error)
        return cached
      }
      throw error
    }
  }

  /**
   * Очистить весь кэш
   */
  async clearCache(): Promise<void> {
    await db.clearAllCache()
  }

  /**
   * Получить статистику кэша
   */
  async getCacheStats() {
    return db.getCacheStats()
  }

  /**
   * Получить информацию о последней синхронизации
   */
  async getLastSync() {
    return db.getLastSuccessfulSync()
  }
}
