import { $raindropApiKey } from "../nanostores/settings";
import {
  CollectionType,
  RaindropItemType,
  safeParseRaindropResponse,
} from "../schemas/raindrop-schemas";
import { createGenericFetcherStore } from "./generic-fetcher";
import { fetchFromRaindropApi } from "./fetchFromRaindropApi";

export function createRaindropsStore(collectionId: CollectionType["_id"]) {
  return createGenericFetcherStore<RaindropItemType[]>(
    [$raindropApiKey, "raindrops", collectionId],
    {
      dedupeTime: 1000 * 60 * 60, // 1 hour
      fetcher: async (raindropApiKey, _, collectionId) => {
        return fetchFromRaindropApi(raindropApiKey as string, `/raindrops/${collectionId}`)
          .then(safeParseRaindropResponse)
          .then((raindrops) =>
            raindrops
              .map((item: RaindropItemType) => ({ ...item, sort: item.sort || 0 }))
              .sort((a, b) => b.sort - a.sort),
          );
      },
    },
  );
}

// Store all created raindrop stores
const raindropsStores = new Map<CollectionType["_id"], ReturnType<typeof createRaindropsStore>>();

/**
 * Fetches all raindrop links for visible categories
 * - Called when category list changes
 * - Creates stores for categories that don't have them yet
 * - Loads data in batches of 5 with 100ms delay between batches
 */
export async function fetchAllLinks(flatCategories: readonly CollectionType["_id"][]) {
  if (!flatCategories || flatCategories.length === 0) {
    return;
  }

  // Get API key to check if we should fetch
  const apiKey = $raindropApiKey.get();
  if (!apiKey) {
    return;
  }

  // Find categories that need stores created
  const categoriesToCreate = flatCategories.filter((id) => !raindropsStores.has(id));

  if (categoriesToCreate.length === 0) {
    return;
  }

  // Create stores and start fetching in batches
  const BATCH_SIZE = 5;
  const DELAY_MS = 100;

  for (let i = 0; i < categoriesToCreate.length; i += BATCH_SIZE) {
    const batch = categoriesToCreate.slice(i, i + BATCH_SIZE);

    // Create stores for this batch
    batch.forEach((categoryId) => {
      const store = createRaindropsStore(categoryId);
      raindropsStores.set(categoryId, store);

      // Subscribe to trigger initial fetch
      store.subscribe(() => {});
    });

    // Add delay between batches (except for the last batch)
    if (i + BATCH_SIZE < categoriesToCreate.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }
}

/**
 * Get raindrop store for a specific collection
 * Creates the store if it doesn't exist yet
 */
export function getRaindropsStore(collectionId: CollectionType["_id"]) {
  if (!raindropsStores.has(collectionId)) {
    const store = createRaindropsStore(collectionId);
    raindropsStores.set(collectionId, store);
  }
  return raindropsStores.get(collectionId)!;
}
