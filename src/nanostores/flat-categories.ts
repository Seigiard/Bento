import { batched } from 'nanostores'
import { $raindropCollections } from '../nanoquery/raindrop-collections-fetcher'
import { $expandedCollections } from './collection-states'
import { CollectionType } from '../schemas/raindrop-schemas'
import { $isOffline } from './offline'

/**
 * Flattens hierarchical categories into a sorted array of IDs
 * Order:
 * 1. Expanded categories first
 * 2. Then non-expanded categories
 * 3. Nested categories appear right after their parent
 */
export const $flatCategories = batched(
  [$isOffline, $raindropCollections, $expandedCollections],
  (isOffline, collectionsStore, expandedIds) => {
    const collections = collectionsStore.data
    if (isOffline || !collections || !collections.length) {
      return []
    }

    const expandedSet = new Set(expandedIds)
    const result: CollectionType['_id'][] = []
    const processed = new Set<CollectionType['_id']>()

    // Helper function to flatten a category and its children
    function flattenCategory(category: CollectionType) {
      const categoryId = category._id

      if (processed.has(categoryId)) {
        return
      }

      processed.add(categoryId)
      result.push(categoryId)

      // Add children right after parent
      if (category.children && category.children.length > 0) {
        category.children.forEach(child => flattenCategory(child))
      }
    }

    // Separate expanded and non-expanded root categories
    const expandedCategories: CollectionType[] = []
    const nonExpandedCategories: CollectionType[] = []

    collections.forEach(category => {
      if (expandedSet.has(String(category._id))) {
        expandedCategories.push(category)
      } else {
        nonExpandedCategories.push(category)
      }
    })

    // Process expanded categories first (maintaining their original order)
    expandedCategories.forEach(category => flattenCategory(category))

    // Then process non-expanded categories
    nonExpandedCategories.forEach(category => flattenCategory(category))

    return result
  }
)
