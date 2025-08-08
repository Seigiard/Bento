import type { CollectionType } from '../schemas/raindrop-schemas'
import { Collection } from './Collection'

interface NestedCategoriesProps {
  parentCollection: CollectionType
}

export function NestedCollections({ parentCollection }: NestedCategoriesProps) {
  // Если у родительской категории нет детей, не показываем ничего
  if (!parentCollection.children || parentCollection.children.length === 0) {
    return null
  }

  return (
    <>
      {parentCollection.children.map((collection) => (
        <Collection key={collection._id} collection={collection} />
      ))}
    </>
  )
}
