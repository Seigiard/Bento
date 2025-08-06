import { batched } from "nanostores";
import { $userData, $rootCategories, $childCategories } from "../nanoquery/raindrop-fetcher";
import { RaindropCollection, transformCollectionToSimple, User } from "../services/raindrop/raindrop-schemas";

export const $categories = batched([$userData, $rootCategories, $childCategories],
  (user, rootCategories, childCategories): { loading: boolean, data: RaindropCollection[] } => {
    const loading = user.loading || rootCategories.loading || childCategories.loading;

    if (loading || !user.data || !rootCategories.data || !childCategories.data) {
      return {
        loading,
        data: []
      }
    }

    // Сначала сортируем root категории согласно пользовательским группам
    const sortedRootCategories = sortCollectionsByUserGroups(
      rootCategories.data,
      user.data
    )

    // Затем строим иерархическую структуру с дочерними категориями
    const categoriesWithChildren = buildCategoriesWithChildren(
      sortedRootCategories,
      childCategories.data
    )

    return {
      loading,
      data: categoriesWithChildren
    }
  }
)

/**
 * Сортирует коллекции согласно пользовательским группам
 * @param collections - массив коллекций для сортировки
 * @param user - данные пользователя с группами
 * @returns отсортированный массив коллекций
 */
function sortCollectionsByUserGroups(collections: RaindropCollection[], user: User): RaindropCollection[] {
  const collectionMap = new Map(collections.map(col => [col._id, col]))
  const sortedCollections: RaindropCollection[] = []

  // Добавляем коллекции в порядке, определенном пользовательскими группами
  user.groups.forEach((group) => {
    if (!group.hidden && group.collections) {
      group.collections.forEach((colId) => {
        const collection = collectionMap.get(colId)
        if (collection) {
          sortedCollections.push(collection)
          collectionMap.delete(colId) // Удаляем, чтобы не добавить дважды
        }
      })
    }
  })

  // Добавляем коллекции, которые не входят ни в одну группу
  collectionMap.forEach((collection) => {
    sortedCollections.push(collection)
  })

  return sortedCollections
}

/**
 * Рекурсивно найти и добавить дочерние категории
 * @param parentId - ID родительской категории
 * @param allChildCategories - все дочерние категории
 * @param processedIds - уже обработанные ID (для предотвращения циклов)
 * @returns массив дочерних категорий с их детьми
 */
function buildChildHierarchy(
  parentId: number,
  allChildCategories: RaindropCollection[],
  processedIds: Set<number> = new Set()
): RaindropCollection[] {
  if (processedIds.has(parentId)) {
    return [] // Предотвращаем бесконечную рекурсию
  }

  processedIds.add(parentId)

  // Найти прямых детей и отсортировать по полю sort
  const directChildren = allChildCategories
    .filter(child =>
      child.parent?.$id === parentId && !processedIds.has(child._id)
    )
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))

  // Преобразовать в простой формат и добавить их детей рекурсивно
  return directChildren.map(child => {
    const simpleChild = transformCollectionToSimple(child)

    // Рекурсивно найти детей для текущего ребенка
    const grandChildren = buildChildHierarchy(child._id, allChildCategories, new Set(processedIds))

    return {
      ...simpleChild,
      children: grandChildren.length > 0 ? grandChildren : undefined
    }
  })
}

/**
 * Объединяет root категории с их дочерними категориями
 * @param rootCategories - отсортированные root категории
 * @param childCategories - все дочерние категории
 * @returns массив категорий с вложенной структурой
 */
function buildCategoriesWithChildren(
  rootCategories: RaindropCollection[],
  childCategories: RaindropCollection[]
): RaindropCollection[] {
  return rootCategories.map(rootCategory => {
    const simpleRoot = transformCollectionToSimple(rootCategory)

    // Найти дочерние категории для данной root категории
    const children = buildChildHierarchy(rootCategory._id, childCategories)

    return {
      ...simpleRoot,
      children: children.length > 0 ? children : undefined
    }
  })
}
