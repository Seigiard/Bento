import type { RaindropCollection } from '../services/raindrop/raindrop-schemas'
import { Category } from './Category'

interface NestedCategoriesProps {
  parentCollection: RaindropCollection
}

export function NestedCategories({ parentCollection }: NestedCategoriesProps) {
  // Если у родительской категории нет детей, не показываем ничего
  if (!parentCollection.children || parentCollection.children.length === 0) {
    return null
  }

  return (
    <div class="pl-2">
      {parentCollection.children.map((collection) => (
        <Category key={collection._id} collection={collection} />
      ))}
    </div>
  )
}
