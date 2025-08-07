import type { RaindropCollection } from '../services/raindrop/raindrop-schemas'
import { useStore } from '@nanostores/preact'
import { $openCategories, toggleCategory } from '../nanostores/category-state'
import { NestedCategories } from './NestedCategories'
import { CategoryLinks } from './CategoryLinks'

interface CategoryProps {
  collection: RaindropCollection
}

export function Category({ collection }: CategoryProps) {
  const openCategories = useStore($openCategories)
  const categoryId = collection._id.toString()
  const isOpen = openCategories.includes(categoryId)

  return (
    <>
      <h2 className="hover:bg-base-200 rounded text-md font-bold flex items-center gap-2 relative p-2 not-first:mt-2">
        <input
          className="absolute inset-0 appearance-none cursor-pointer"
          type="checkbox"
          name={categoryId}
          checked={isOpen}
          onChange={() => toggleCategory(categoryId)}
        />
        {collection.title}
      </h2>
      {isOpen && (
        <>
          <NestedCategories parentCollection={collection} />
          <CategoryLinks categoryId={collection._id} />
        </>
      )}
    </>
  )
}
