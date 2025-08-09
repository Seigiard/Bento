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
    <div className="collapse hover:bg-base-100 focus-within:bg-base-100 hover:shadow-sm focus-within:shadow-sm has-[input:not(:checked):active]:shadow-xs has-[input:not(:checked):active]:transform-[translateY(-1px)] outline-offset-2 outline-2 outline-transparent transition-[background-color,box-shadow] duration-200 not-first:mt-1 max-h-full snap-start">
      <input
        type="checkbox"
        name={categoryId}
        checked={isOpen}
        onChange={() => toggleCategory(categoryId)}
      />
      <div className="collapse-title px-5 font-serif font-semibold text-lg">{collection.title}</div>
      <div className="collapse-content flex px-0 min-w-0 min-h-0 max-h-full overflow-y-scroll text-sm transform-[translateY(-0.75rem)]">
        {isOpen && (
          <ul className='px-2 pt-1 -mb-3 w-full max-h-full h-fit'>
            <CollectionLinks collectionId={collection._id} />
            <NestedCollections parentCollection={collection} />
          </ul>
        )}
      </div>
    </div>
  )
}
