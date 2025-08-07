import { batched } from "nanostores";
import { $userData, $rootCategories, $childCategories } from "../nanoquery/raindrop-fetcher";
import { CollectionType, UserType } from "../services/raindrop/raindrop-schemas";

type FetcherResponse<T> = {
  loading: boolean;
  data?: T;
  error?: Error;
};

export const $collections = batched([$userData, $rootCategories, $childCategories],
  (user, rootCategories, childCategories): FetcherResponse<CollectionType[]> => {
    const loading = user.loading || rootCategories.loading || childCategories.loading;

    // Проверяем ошибки в любой из зависимостей
    const error = user.error || rootCategories.error || childCategories.error;
    if (error) {
      return {
        loading,
        data: [],
        error
      }
    }

    if (loading || !user.data || !rootCategories.data || !childCategories.data) {
      return {
        loading,
        data: []
      }
    }

    try {
      // Этап 1: Собираем общий массив всех категорий
      const allCategories = [...rootCategories.data, ...childCategories.data]

      // Этап 2: Строим иерархическую структуру
      const hierarchicalCategories = buildHierarchy(allCategories)

      // Этап 3: Сортируем первый уровень по пользовательским группам
      const sortedByUserGroups = sortCollectionsByUserGroups(hierarchicalCategories, user.data)

      // Этап 4: Сортируем все вложенные уровни по полю sort
      const finallySorted = sortAllNestedLevels(sortedByUserGroups)

      return {
        loading,
        data: finallySorted
      }
    } catch (buildError) {
      console.error('Error building category hierarchy:', buildError)
      return {
        loading,
        data: [],
        error: buildError instanceof Error ? buildError : new Error('Failed to build category hierarchy')
      }
    }
  }
)

/**
 * Строит иерархическую структуру из плоского массива категорий
 * @param allCategories - все категории (root + child)
 * @returns массив root категорий с вложенными детьми
 */
function buildHierarchy(allCategories: CollectionType[]): CollectionType[] {
  // Разделяем на root и child категории
  const rootCategories = allCategories.filter(cat => !cat.parent)
  const childCategories = allCategories.filter(cat => cat.parent)

  return rootCategories.map(rootCategory => {
    const children = buildChildHierarchy(rootCategory._id, childCategories)

    return {
      ...rootCategory,
      children: children.length > 0 ? children : undefined
    }
  })
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
  allChildCategories: CollectionType[],
  processedIds: Set<number> = new Set()
): CollectionType[] {
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

  // Добавить их детей рекурсивно
  return directChildren.map(child => {
    // Рекурсивно найти детей для текущего ребенка
    const grandChildren = buildChildHierarchy(child._id, allChildCategories, new Set(processedIds))

    return {
      ...child,
      children: grandChildren.length > 0 ? grandChildren : undefined
    }
  })
}

/**
 * Сортирует коллекции согласно пользовательским группам
 * @param collections - массив коллекций для сортировки
 * @param user - данные пользователя с группами
 * @returns отсортированный массив коллекций
 */
function sortCollectionsByUserGroups(collections: CollectionType[], user: UserType): CollectionType[] {
  const collectionMap = new Map(collections.map(col => [col._id, col]))
  const sortedCollections: CollectionType[] = []

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
 * Рекурсивно сортирует все вложенные уровни по полю sort
 * @param categories - категории с детьми
 * @returns категории с отсортированными детьми на всех уровнях
 */
function sortAllNestedLevels(categories: CollectionType[]): CollectionType[] {
  return categories.map(category => {
    if (!category.children) {
      return category
    }

    // Сортируем детей по полю sort и рекурсивно сортируем их детей
    const sortedChildren = category.children
      .sort((a: CollectionType, b: CollectionType) => (a.sort || 0) - (b.sort || 0))
      .map((child: CollectionType) => sortAllNestedLevels([child])[0])

    return {
      ...category,
      children: sortedChildren
    }
  })
}
