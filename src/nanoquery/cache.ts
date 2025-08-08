import { get as dbGet, set as dbSet, keys as dbKeys } from '@isomorphic-git/idb-keyval';
import { atom, onStart } from 'nanostores';
const cacheKey = 'raindropFetcher-';

class Cache extends Map {
  set(key: string, value: unknown, persist = true) {
    const res = super.set(key, value);
    if (persist) {
      dbSet(`${cacheKey}${key}`, value);
    }
    return res;
  }
}

export const cache = new Cache();

async function initCache() {
  const keys_ = await dbKeys()
  return Promise.all(keys_.map(async (key) => {
    if (typeof key === 'string' && key.startsWith(cacheKey)) {
      const value = await dbGet(key)
      cache.set(key.replace(cacheKey, ''), value, false);
    }
  }))
}

export const $cacheReady = atom(false);

onStart($cacheReady, () => {
  initCache().then(() => $cacheReady.set(true));
});
