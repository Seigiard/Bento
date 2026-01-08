import { get as dbGet, set as dbSet, keys as dbKeys } from "@isomorphic-git/idb-keyval";
import { atom, onStart } from "nanostores";
import { dequal } from "dequal/lite";

const cacheKey = "BentoAppRaindrops-";

class Cache extends Map {
  set(key: string, value: unknown, persist = true) {
    const res = super.set(key, value);
    if (persist) {
      void dbSet(`${cacheKey}${key}`, value);
    }
    return res;
  }
}

export const cache = new Cache();

async function initCache() {
  const keys_ = await dbKeys();
  return Promise.all(
    keys_.map(async (key_) => {
      if (typeof key_ === "string" && key_.startsWith(cacheKey)) {
        const value = await dbGet(key_);
        const key = key_.replace(cacheKey, "");
        if (!dequal(cache.get(key), value)) {
          cache.set(key, value, false);
        }
      }
    }),
  );
}

export const $cacheReady = atom(false);

onStart($cacheReady, () => {
  initCache()
    .then(() => $cacheReady.set(true))
    .catch((err) => console.error("Failed to initialize cache:", err));
});
