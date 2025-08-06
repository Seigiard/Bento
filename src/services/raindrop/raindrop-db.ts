import type { Table } from 'dexie'
import type { RaindropCollection, RaindropItem, User } from './raindrop-schemas.js'
import Dexie from 'dexie'

export interface CachedCollection extends RaindropCollection {
  cachedAt: number
  ttl: number
  sortOrder: number // Порядок сортировки при сохранении
}

export interface CachedRaindropItem extends RaindropItem {
  collectionId: number
  cachedAt: number
  ttl: number
}

export interface CachedUser extends User {
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

export interface CollectionState {
  collectionId: number
  isExpanded: boolean
  updatedAt: number
}

export class RaindropDatabase extends Dexie {
  // Таблицы
  collections!: Table<CachedCollection, number>
  childCollections!: Table<CachedCollection, number>
  raindrops!: Table<CachedRaindropItem, number>
  user!: Table<CachedUser, number>
  syncMetadata!: Table<SyncMetadata, string>
  collectionStates!: Table<CollectionState, number>

  constructor() {
    super('RaindropDB')

    // Определяем схему базы данных
    this.version(1).stores({
      // Коллекции (корневые и дочерние в разных таблицах для упрощения)
      collections: '_id, title, sort, cachedAt, sortOrder',
      childCollections: '_id, parent.$id, title, sort, cachedAt',

      // Raindrops с индексами для поиска по коллекции
      raindrops: '_id, collectionId, title, domain, created, cachedAt, [collectionId+cachedAt]',

      // Пользователь (только один)
      user: '_id, email, cachedAt',

      // Метаданные синхронизации
      syncMetadata: 'id, lastSync, syncType, status',

      // Состояние коллекций (свернуто/развернуто)
      collectionStates: 'collectionId, isExpanded, updatedAt',
    })
  }

  /**
   * Проверить валидность кэша
   */
  isCacheValid(cachedAt: number, ttl: number): boolean {
    return Date.now() - cachedAt < ttl
  }

  /**
   * Получить корневые коллекции
   */
  async getCachedRootCollections(): Promise<CachedCollection[] | null> {
    const collections = await this.collections.orderBy('sortOrder').toArray()

    if (collections.length === 0)
      return null

    // Проверяем, что все коллекции еще валидны
    const allValid = collections.every(col => this.isCacheValid(col.cachedAt, col.ttl))

    return allValid ? collections : null
  }

  /**
   * Сохранить корневые коллекции
   */
  async cacheRootCollections(collections: RaindropCollection[], ttl: number): Promise<void> {
    const cachedCollections: CachedCollection[] = collections.map((col, index) => ({
      ...col,
      cachedAt: Date.now(),
      ttl,
      sortOrder: index, // Сохраняем порядок
    }))

    await this.transaction('rw', this.collections, async () => {
      // Очищаем старые данные
      await this.collections.clear()
      // Добавляем новые
      await this.collections.bulkAdd(cachedCollections)
    })
  }

  /**
   * Получить дочерние коллекции
   */
  async getCachedChildCollections(): Promise<CachedCollection[] | null> {
    const collections = await this.childCollections.toArray()

    if (collections.length === 0)
      return null

    const allValid = collections.every(col => this.isCacheValid(col.cachedAt, col.ttl))

    return allValid ? collections : null
  }

  /**
   * Сохранить дочерние коллекции
   */
  async cacheChildCollections(collections: RaindropCollection[], ttl: number): Promise<void> {
    const cachedCollections: CachedCollection[] = collections.map(col => ({
      ...col,
      cachedAt: Date.now(),
      ttl,
    }))

    await this.transaction('rw', this.childCollections, async () => {
      await this.childCollections.clear()
      await this.childCollections.bulkAdd(cachedCollections)
    })
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
   * Получить данные пользователя
   */
  async getCachedUser(): Promise<CachedUser | null> {
    const users = await this.user.toArray()

    if (users.length === 0)
      return null

    const user = users[0]

    return this.isCacheValid(user.cachedAt, user.ttl) ? user : null
  }

  /**
   * Сохранить данные пользователя
   */
  async cacheUser(user: User, ttl: number): Promise<void> {
    const cachedUser: CachedUser = {
      ...user,
      cachedAt: Date.now(),
      ttl,
    }

    await this.transaction('rw', this.user, async () => {
      await this.user.clear()
      await this.user.add(cachedUser)
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
    await this.transaction('rw', this.collections, this.childCollections, this.raindrops, this.user, async () => {
      await this.collections.clear()
      await this.childCollections.clear()
      await this.raindrops.clear()
      await this.user.clear()
    })
  }

  /**
   * Получить состояние коллекции (свернуто/развернуто)
   */
  async getCollectionState(collectionId: number): Promise<boolean> {
    const state = await this.collectionStates.get(collectionId)
    return state?.isExpanded ?? false // По умолчанию свернуто
  }

  /**
   * Сохранить состояние коллекции
   */
  async setCollectionState(collectionId: number, isExpanded: boolean): Promise<void> {
    const state: CollectionState = {
      collectionId,
      isExpanded,
      updatedAt: Date.now(),
    }

    await this.collectionStates.put(state)
  }

  /**
   * Получить статистику кэша
   */
  async getCacheStats(): Promise<{
    collections: number
    childCollections: number
    raindrops: number
    totalSize: number
    oldestCache: number | null
  }> {
    const [collectionsCount, childCollectionsCount, raindropsCount] = await Promise.all([
      this.collections.count(),
      this.childCollections.count(),
      this.raindrops.count(),
    ])

    // Находим самую старую запись
    const oldestDates = await Promise.all([
      this.collections.orderBy('cachedAt').first(),
      this.childCollections.orderBy('cachedAt').first(),
      this.raindrops.orderBy('cachedAt').first(),
    ])

    const oldestCache = Math.min(
      ...oldestDates
        .filter(item => item)
        .map(item => item!.cachedAt),
    )

    return {
      collections: collectionsCount,
      childCollections: childCollectionsCount,
      raindrops: raindropsCount,
      totalSize: collectionsCount + childCollectionsCount + raindropsCount,
      oldestCache: isFinite(oldestCache) ? oldestCache : null,
    }
  }
}

// Экспортируем singleton экземпляр
export const db = new RaindropDatabase()
