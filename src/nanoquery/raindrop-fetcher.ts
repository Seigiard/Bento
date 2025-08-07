import { Fetcher, nanoquery } from '@nanostores/query';
import { $settings } from '../nanostores/settings';
import { RaindropCollection, RaindropCollectionFull, safeParseCollection, User } from '../services/raindrop/raindrop-schemas';
import { batched, ReadableAtom } from 'nanostores';

export const [createRaindropApiFetcherStore, createRaindropApiMutatorStore] = nanoquery({
  fetcher: async (...keys) => {
    return fetch(`https://api.raindrop.io/rest/v1${keys.join('')}`, {
      headers: {
        'Authorization': `Bearer ${$settings.get().raindropApiKey}`,
        'Content-Type': 'application/json',
      },
    }).then((r) => r.json())
  },
});

const $fetchedUserData = createRaindropApiFetcherStore<{ user: User }>('/user');
const $fetchedRootCategories = createRaindropApiFetcherStore<{ items: RaindropCollectionFull[] }>('/collections');
const $fetchedChildCategories = createRaindropApiFetcherStore<{ items: RaindropCollectionFull[] }>('/collections/childrens');

export const $userData: ReadableAtom<{ loading: boolean; data?: User }> = batched($fetchedUserData, ({ loading, data }) => ({
  loading,
  data: data?.user,
}));

export const $rootCategories: ReadableAtom<{ loading: boolean; data?: RaindropCollection[] }> = batched($fetchedRootCategories, ({ loading, data }) => ({
  loading,
  data: data?.items?.map(safeParseCollection),
}));

export const $childCategories: ReadableAtom<{ loading: boolean; data?: RaindropCollection[] }> = batched($fetchedChildCategories, ({ loading, data }) => ({
  loading,
  data: data?.items?.map(safeParseCollection),
}));
