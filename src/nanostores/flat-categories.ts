import { batched } from "nanostores";

import { $raindropCollections } from "../nanoquery/raindrop-collections-fetcher";
import { CollectionType } from "../schemas/raindrop-schemas";

import { $pinnedCategories } from "./collection-states";
import { $isOffline } from "./offline";

/**
 * Sorts root collections: pinned first, then unpinned
 */
export const $sortedCollections = batched(
  [$isOffline, $raindropCollections, $pinnedCategories],
  (isOffline, collectionsStore, pinnedIds) => {
    const collections = collectionsStore.data;
    if (isOffline || !collections || !collections.length) {
      return [];
    }

    const pinnedSet = new Set(pinnedIds);
    const pinned: CollectionType[] = [];
    const unpinned: CollectionType[] = [];

    collections.forEach((category) => {
      if (pinnedSet.has(String(category._id))) {
        pinned.push(category);
      } else {
        unpinned.push(category);
      }
    });

    return [...pinned, ...unpinned];
  },
);

/**
 * Flattens hierarchical categories into a sorted array of IDs
 * Used for prefetching links in order
 */
export const $flatCategories = batched([$sortedCollections], (sortedCollections) => {
  if (!sortedCollections || !sortedCollections.length) {
    return [];
  }

  const result: CollectionType["_id"][] = [];
  const processed = new Set<CollectionType["_id"]>();

  function flattenCategory(category: CollectionType) {
    const categoryId = category._id;

    if (processed.has(categoryId)) {
      return;
    }

    processed.add(categoryId);
    result.push(categoryId);

    if (category.children && category.children.length > 0) {
      category.children.forEach((child: CollectionType) => flattenCategory(child));
    }
  }

  sortedCollections.forEach((category) => flattenCategory(category));

  return result;
});
