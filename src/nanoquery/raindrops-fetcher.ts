import { $raindropApiKey } from '../nanostores/settings';
import { CollectionType, RaindropItemType, safeParseRaindropResponse } from '../schemas/raindrop-schemas';
import { createGenericFetcherStore } from './generic-fetcher';
import { fetchFromRaindropApi } from './fetchFromRaindropApi';

export function createRaindropsStore(collectionId: CollectionType['_id']) {
  return createGenericFetcherStore<RaindropItemType[]>([$raindropApiKey, 'raindrops', collectionId], {
    dedupeTime: 1000 * 60 * 60, // 1 hour
    fetcher: async (raindropApiKey, _, collectionId) => {
      return fetchFromRaindropApi(raindropApiKey as string, `/raindrops/${collectionId}`)
        .then(safeParseRaindropResponse)
        .then(raindrops => raindrops
          .map((item: RaindropItemType) => ({ ...item, sort: item.sort || 0 }))
          .sort((a, b) => b.sort - a.sort)
        )
    }
  })
}
