import { Fetcher, nanoquery } from '@nanostores/query';
import { $settings } from '../nanostores/settings';
import { RaindropCollection, safeParseCollectionResponse, safeParseRaindropResponse, safeParseUserResponse, User } from '../services/raindrop/raindrop-schemas';
import { batched, ReadableAtom } from 'nanostores';

export type FetcherResponse<T> = {
  loading: boolean;
  data?: T;
  error?: Error;
};

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

export const $userData = createRaindropApiFetcherStore<{ data: User }>('/user');
export const $rootCategories = createRaindropApiFetcherStore<{ data: RaindropCollection[] }>('/collections');
export const $childCategories = createRaindropApiFetcherStore<{ data: RaindropCollection[] }>(['/collections', '/childrens']);

export const createRaindropsStore = (collectionId: RaindropCollection['_id']) => createRaindropApiFetcherStore<{ items: RaindropCollection[] }>(['/raindrops', '/', collectionId]);

function safeParseData(key: string, data: unknown) {
  switch (key) {
    case '/user':
      return safeParseUserResponse(data);
    case '/collections':
      return safeParseCollectionResponse(data)
    case '/raindrops':
      return safeParseRaindropResponse(data)
    default:
      return data
  }
}
