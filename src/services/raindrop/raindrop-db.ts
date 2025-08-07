import type { Table } from 'dexie'
import type { RaindropItem } from './raindrop-schemas'
import Dexie from 'dexie'


export interface CachedRaindropItem extends RaindropItem {
  collectionId: number
  cachedAt: number
  ttl: number
}


export interface SyncMetadata {
  id: string
  lastSync: number
  syncType: 'full' | 'partial'
  status: 'success' | 'failed'
  error?: string
}

export class RaindropDatabase extends Dexie {
  // Таблицы
  raindrops!: Table<CachedRaindropItem, number>
  syncMetadata!: Table<SyncMetadata, string>

  constructor() {
    super('RaindropDB')

    // Определяем схему базы данных
    this.version(1).stores({
      // Raindrops с индексами для поиска по коллекции
      raindrops: '_id, collectionId, title, domain, created, cachedAt, [collectionId+cachedAt]',

      // Метаданные синхронизации
      syncMetadata: 'id, lastSync, syncType, status',
    })
  }

  /**
   * Проверить валидность кэша
   */
  isCacheValid(cachedAt: number, ttl: number): boolean {
    return Date.now() - cachedAt < ttl
  }


  /**
   * Получить raindrops для коллекции
   */
  async getCachedRaindrops(collectionId: number): Promise<CachedRaindropItem[] | null> {
    const raindrops = await this.raindrops
      .where('collectionId')
      .equals(collectionId)
      .toArray()

    if (raindrops.length === 0)
      return null

    // Проверяем валидность по первому элементу (все должны быть сохранены одновременно)
    const firstItem = raindrops[0]
    if (!this.isCacheValid(firstItem.cachedAt, firstItem.ttl))
      return null

    return raindrops
  }

  /**
   * Сохранить raindrops для коллекции
   */
  async cacheRaindrops(collectionId: number, raindrops: RaindropItem[], ttl: number): Promise<void> {
    const cachedRaindrops: CachedRaindropItem[] = raindrops.map(item => ({
      ...item,
      collectionId,
      cachedAt: Date.now(),
      ttl,
    }))

    await this.transaction('rw', this.raindrops, async () => {
      // Удаляем старые raindrops для этой коллекции
      await this.raindrops.where('collectionId').equals(collectionId).delete()
      // Добавляем новые
      await this.raindrops.bulkAdd(cachedRaindrops)
    })
  }


  /**
   * Записать метаданные синхронизации
   */
  async recordSync(syncType: 'full' | 'partial', status: 'success' | 'failed', error?: string): Promise<void> {
    const metadata: SyncMetadata = {
      id: `sync_${Date.now()}`,
      lastSync: Date.now(),
      syncType,
      status,
      error,
    }

    await this.syncMetadata.add(metadata)
  }

  /**
   * Получить последнюю успешную синхронизацию
   */
  async getLastSuccessfulSync(): Promise<SyncMetadata | null> {
    const lastSync = await this.syncMetadata
      .where('status')
      .equals('success')
      .reverse()
      .first()

    return lastSync || null
  }

  /**
   * Очистить все кэшированные данные
   */
  async clearAllCache(): Promise<void> {
    await this.transaction('rw', this.raindrops, async () => {
      await this.raindrops.clear()
    })
  }

  /**
   * Получить статистику кэша
   */
  async getCacheStats(): Promise<{
    raindrops: number
    totalSize: number
    oldestCache: number | null
  }> {
    const raindropsCount = await this.raindrops.count()

    // Находим самую старую запись
    const oldestRaindrop = await this.raindrops.orderBy('cachedAt').first()

    const oldestCache = oldestRaindrop?.cachedAt || null

    return {
      raindrops: raindropsCount,
      totalSize: raindropsCount,
      oldestCache,
    }
  }
}

// Экспортируем singleton экземпляр
export const db = new RaindropDatabase()
