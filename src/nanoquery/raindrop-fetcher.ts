import { nanoquery } from '@nanostores/query';
import { atom, onStart } from 'nanostores';
import { $settings } from '../nanostores/settings';
import { CollectionType, RaindropItemType, safeParseCollectionResponse, safeParseRaindropResponse, safeParseUserResponse, UserType } from '../schemas/raindrop-schemas';
import { get, set, keys } from '@isomorphic-git/idb-keyval';

const cacheKey = 'raindropFetcher-';

class Cache extends Map {
  set(key: string, value: any, persist = true) {
    const res = super.set(key, value);
    persist && set(`${cacheKey}${key}`, value);
    return res;
  }
}
const cache = new Cache();

async function initCache() {
  const keys_ = await keys()
  return Promise.all(keys_.map(async (key) => {
    if (typeof key === 'string' && key.startsWith(cacheKey)) {
      const value = await get(key)
      cache.set(key.replace(cacheKey, ''), value, false);
    }
  }))
}

export const $fetcherReady = atom(false);
onStart($fetcherReady, () => {
  initCache().then(() => $fetcherReady.set(true));
});

const [createRaindropApiFetcherStore] = nanoquery({
  cache,
  dedupeTime: 1000 * 60 * 60, // 1 hour
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

export const $userData = createRaindropApiFetcherStore<UserType>('/user');
export const $rootCategories = createRaindropApiFetcherStore<CollectionType[]>('/collections');
export const $childCategories = createRaindropApiFetcherStore<CollectionType[]>(['/collections/childrens']);

export const createRaindropsStore = (collectionId: CollectionType['_id']) => createRaindropApiFetcherStore<RaindropItemType[]>(['/raindrops/', collectionId]);

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
