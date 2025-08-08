import type { CollectionType } from '../schemas/raindrop-schemas'
import { useStore } from '@nanostores/preact'
import { $expandedCollections, toggleCategory } from '../nanostores/collection-states'
import { NestedCollections } from './NestedCollections'
import { CollectionLinks } from './CategoryLinks'

interface CategoryProps {
  collection: CollectionType
}

export function Collection({ collection }: CategoryProps) {
  const openCategories = useStore($expandedCollections)
  const categoryId = collection._id.toString()
  const isOpen = openCategories.includes(categoryId)

  return (
    <div className="collapse not-first:mt-4 shadow-sm bg-base-100 max-h-full">
      <input
        type="checkbox"
        name={categoryId}
        checked={isOpen}
        onChange={() => toggleCategory(categoryId)}
      />
      <div className="collapse-title font-semibold">{collection.title}</div>
      <div className="collapse-content -my-2 px-2 min-w-0 min-h-0 grid text-sm overflow-y-scroll">
        {isOpen && (
          <>
            <NestedCollections parentCollection={collection} />
            <CollectionLinks collectionId={collection._id} />
          </>
        )}
      </div>
    </div>
  )
}
