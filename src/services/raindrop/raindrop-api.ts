import type { RaindropCollection, RaindropItem, User } from './raindrop-schemas'
import * as v from 'valibot'
import {
  RaindropsApiResponseSchema,
  safeParseRaindrop,
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
      return response.items.map(safeParseRaindrop)
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
