import type { CollectionType } from '../schemas/raindrop-schemas'
import { Category } from './Category'

interface NestedCategoriesProps {
  parentCollection: CollectionType
}

export function NestedCategories({ parentCollection }: NestedCategoriesProps) {
  // Если у родительской категории нет детей, не показываем ничего
  if (!parentCollection.children || parentCollection.children.length === 0) {
    return null
  }

  return (
    <>
      {parentCollection.children.map((collection) => (
        <Category key={collection._id} collection={collection} />
      ))}
    </>
  )
}
