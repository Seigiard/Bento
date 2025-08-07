import { Fetcher, nanoquery } from '@nanostores/query';
import { $settings } from '../nanostores/settings';
import { RaindropCollection, safeParseCollection, User } from '../services/raindrop/raindrop-schemas';
import { batched, ReadableAtom } from 'nanostores';

export type FetcherResponse<T> = {
  loading: boolean;
  data?: T;
  error?: Error;
};

export const [createRaindropApiFetcherStore, createRaindropApiMutatorStore] = nanoquery({
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
      return data
    } catch (error) {
      console.error('Raindrop API fetcher error:', error)
      throw error instanceof Error ? error : new Error('Unknown fetcher error')
    }
  },
});

const $fetchedUserData = createRaindropApiFetcherStore<{ user: User }>('/user');
const $fetchedRootCategories = createRaindropApiFetcherStore<{ items: RaindropCollection[] }>('/collections');
const $fetchedChildCategories = createRaindropApiFetcherStore<{ items: RaindropCollection[] }>('/collections/childrens');

export const $userData: ReadableAtom<FetcherResponse<User>> = batched($fetchedUserData, ({ loading, data, error }) => ({
  loading,
  data: data?.user,
  error,
}));

export const $rootCategories: ReadableAtom<FetcherResponse<RaindropCollection[]>> = batched($fetchedRootCategories, ({ loading, data, error }) => {
  if (error) {
    return { loading, error }
  }

  try {
    return {
      loading,
      data: data?.items?.map(safeParseCollection).filter(col => col !== null),
    }
  } catch (parseError) {
    console.error('Error parsing root categories:', parseError)
    return {
      loading,
      error: parseError instanceof Error ? parseError : new Error('Failed to parse root categories')
    }
  }
});

export const $childCategories: ReadableAtom<FetcherResponse<RaindropCollection[]>> = batched($fetchedChildCategories, ({ loading, data, error }) => {
  if (error) {
    return { loading, error }
  }

  try {
    return {
      loading,
      data: data?.items?.map(safeParseCollection).filter(col => col !== null),
    }
  } catch (parseError) {
    console.error('Error parsing child categories:', parseError)
    return {
      loading,
      error: parseError instanceof Error ? parseError : new Error('Failed to parse child categories')
    }
  }
});
