import { Fetcher, nanoquery } from '@nanostores/query';
import { $settings } from '../nanostores/settings';
import { RaindropCollection, RaindropItem, safeParseCollectionResponse, safeParseRaindropResponse, safeParseUserResponse, User } from '../services/raindrop/raindrop-schemas';

const [createRaindropApiFetcherStore] = nanoquery({
  fetcher: async (...keys) => {
    try {
      const response = await fetch(`https://api.raindrop.io/rest/v1${keys.join('')}`, {
        headers: {
          'Authorization': `Bearer ${$settings.get().raindropApiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Raindrop API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return safeParseData(keys[0].toString(), data)
    } catch (error) {
      console.error('Raindrop API fetcher error:', error)
      throw error instanceof Error ? error : new Error('Unknown fetcher error')
    }
  },
});

export const $userData = createRaindropApiFetcherStore<User>('/user');
export const $rootCategories = createRaindropApiFetcherStore<RaindropCollection[]>('/collections');
export const $childCategories = createRaindropApiFetcherStore<RaindropCollection[]>(['/collections/childrens']);

export const createRaindropsStore = (collectionId: RaindropCollection['_id']) => createRaindropApiFetcherStore<RaindropItem[]>(['/raindrops/', collectionId]);

function safeParseData(key: string, data: unknown) {
  switch (true) {
    case key.startsWith('/user'):
      return safeParseUserResponse(data);
    case key.startsWith('/collections'):
      return safeParseCollectionResponse(data)
    case key.startsWith('/raindrops'):
      return safeParseRaindropResponse(data)
    default:
      return data
  }
}
