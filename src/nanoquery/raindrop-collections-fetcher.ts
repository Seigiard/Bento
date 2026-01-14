import { $raindropApiKey } from "../nanostores/settings";
import {
  CollectionType,
  safeParseCollectionResponse,
  safeParseUserResponse,
  UserType,
} from "../schemas/raindrop-schemas";

import { fetchFromRaindropApi } from "./fetchFromRaindropApi";
import { createGenericFetcherStore } from "./generic-fetcher";

export const $raindropCollections = createGenericFetcherStore([$raindropApiKey, "collections"], {
  dedupeTime: 1000 * 60 * 5, // 5 min — only for request deduplication, SW handles caching
  fetcher: async (raindropApiKey) => {
    const fetchUser = fetchFromRaindropApi(raindropApiKey as string, "/user").then(
      safeParseUserResponse,
    );
    const fetchRootCollections = fetchFromRaindropApi(
      raindropApiKey as string,
      "/collections",
    ).then(safeParseCollectionResponse);
    const fetchChildCollections = fetchFromRaindropApi(
      raindropApiKey as string,
      "/collections/childrens",
    ).then(safeParseCollectionResponse);

    const [user, rootCollections, childCollections] = await Promise.all([
      fetchUser,
      fetchRootCollections,
      fetchChildCollections,
    ]);

    try {
      const allCategories = [...rootCollections, ...childCollections];
      const hierarchicalCategories = buildHierarchy(allCategories);
      const sortedByUserGroups = sortCollectionsByUserGroups(hierarchicalCategories, user);
      const finallySorted = sortAllNestedLevels(sortedByUserGroups);

      return finallySorted;
    } catch (buildError) {
      console.error("Error building category hierarchy:", buildError);
      throw buildError;
    }
  },
});

/**
 * Builds hierarchical structure from flat array of categories
 */
function buildHierarchy(allCategories: CollectionType[]): CollectionType[] {
  const rootCategories = allCategories.filter((cat) => !cat.parent);
  const childCategories = allCategories.filter((cat) => cat.parent);

  return rootCategories.map((rootCategory) => {
    const children = buildChildHierarchy(rootCategory._id, childCategories);

    return {
      ...rootCategory,
      children: children.length > 0 ? children : undefined,
    };
  });
}

/**
 * Recursively finds and adds child categories
 */
function buildChildHierarchy(
  parentId: number,
  allChildCategories: CollectionType[],
  processedIds: Set<number> = new Set(),
): CollectionType[] {
  if (processedIds.has(parentId)) {
    return [];
  }

  processedIds.add(parentId);

  const directChildren = allChildCategories
    .filter((child) => child.parent?.$id === parentId && !processedIds.has(child._id))
    .sort((a, b) => (a.sort || 0) - (b.sort || 0));

  return directChildren.map((child) => {
    const grandChildren = buildChildHierarchy(child._id, allChildCategories, new Set(processedIds));

    return {
      ...child,
      children: grandChildren.length > 0 ? grandChildren : undefined,
    };
  });
}

/**
 * Sorts collections according to user groups order
 */
function sortCollectionsByUserGroups(
  collections: CollectionType[],
  user: UserType,
): CollectionType[] {
  const collectionMap = new Map(collections.map((col) => [col._id, col]));
  const sortedCollections: CollectionType[] = [];

  user.groups.forEach((group) => {
    if (!group.hidden && group.collections) {
      group.collections.forEach((colId) => {
        const collection = collectionMap.get(colId);
        if (collection) {
          sortedCollections.push(collection);
          collectionMap.delete(colId);
        }
      });
    }
  });

  collectionMap.forEach((collection) => {
    sortedCollections.push(collection);
  });

  return sortedCollections;
}

/**
 * Recursively sorts all nested levels by sort field
 */
function sortAllNestedLevels(categories: CollectionType[]): CollectionType[] {
  return categories.map((category) => {
    if (!category.children) {
      return category;
    }

    const sortedChildren = category.children
      .sort((a: CollectionType, b: CollectionType) => (a.sort || 0) - (b.sort || 0))
      .map((child: CollectionType) => sortAllNestedLevels([child])[0]);

    return {
      ...category,
      children: sortedChildren,
    };
  });
}
