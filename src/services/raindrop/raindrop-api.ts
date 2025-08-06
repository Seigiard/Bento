import type { RaindropCollection, RaindropItem, User } from './raindrop-schemas'
import * as v from 'valibot'
import {
  CollectionsApiResponseSchema,

  RaindropsApiResponseSchema,
  transformCollectionToSimple,
  transformRaindropToSimple,

  UserApiResponseSchema,
} from './raindrop-schemas.js'

export class RaindropAPI {
  private apiKey: string
  private baseUrl = 'https://api.raindrop.io/rest/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async makeRequest<T>(
    endpoint: string,
    schema: v.BaseSchema<unknown, T, any>,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Raindrop API error: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()

    try {
      return v.parse(schema, data)
    }
    catch (error) {
      console.error('Schema validation error:', error)
      throw new Error('Invalid response format from Raindrop API')
    }
  }

  /**
   * Получить данные пользователя
   */
  async getUser(): Promise<User | null> {
    try {
      const response = await this.makeRequest('/user', UserApiResponseSchema)
      return response.user
    }
    catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  /**
   * Получить корневые коллекции с правильной сортировкой из groups.collections
   */
  async getRootCollections(): Promise<RaindropCollection[]> {
    try {
      // Получаем коллекции и данные пользователя параллельно
      const [collectionsResponse, user] = await Promise.all([
        this.makeRequest('/collections', CollectionsApiResponseSchema),
        this.getUser(),
      ])

      const collections = collectionsResponse.items.map(transformCollectionToSimple)

      // Если нет данных пользователя или групп, сортируем по полю sort
      if (!user || !user.groups || user.groups.length === 0) {
        return collections.sort((a, b) => {
          const sortA = a.sort || 0
          const sortB = b.sort || 0
          return sortA - sortB
        })
      }

      // Создаем Map для быстрого поиска коллекций по ID
      const collectionMap = new Map<number, RaindropCollection>()
      collections.forEach(col => collectionMap.set(col._id, col))

      // Собираем отсортированные коллекции согласно порядку в groups.collections
      const sortedCollections: RaindropCollection[] = []

      user.groups.forEach((group) => {
        if (!group.hidden && group.collections) {
          group.collections.forEach((colId) => {
            const collection = collectionMap.get(colId)
            if (collection) {
              sortedCollections.push(collection)
              collectionMap.delete(colId) // Удаляем, чтобы не добавить дважды
            }
          })
        }
      })

      // Добавляем коллекции, которые не входят ни в одну группу
      collectionMap.forEach((collection) => {
        sortedCollections.push(collection)
      })

      return sortedCollections
    }
    catch (error) {
      console.error('Error fetching root collections:', error)
      return []
    }
  }

  /**
   * Получить дочерние коллекции для указанной родительской коллекции
   */
  async getChildCollections(parentId?: number): Promise<RaindropCollection[]> {
    try {
      const response = await this.makeRequest('/collections/childrens', CollectionsApiResponseSchema)
      const allChildren = response.items.map(transformCollectionToSimple)

      // Если указан parentId, фильтруем только его дочерние коллекции
      if (parentId !== undefined) {
        return allChildren.filter(col => col.parent?.$id === parentId)
      }

      // Иначе возвращаем все дочерние коллекции
      return allChildren
    }
    catch (error) {
      console.error('Error fetching child collections:', error)
      return []
    }
  }

  /**
   * Получить raindrops для указанной коллекции
   */
  async getRaindrops(
    collectionId: number,
    perpage = 50,
  ): Promise<RaindropItem[]> {
    try {
      const response = await this.makeRequest(
        `/raindrops/${collectionId}?perpage=${perpage}`,
        RaindropsApiResponseSchema,
      )
      return response.items.map(transformRaindropToSimple)
    }
    catch (error) {
      console.error(
        `Error fetching raindrops for collection ${collectionId}:`,
        error,
      )
      return []
    }
  }
}
