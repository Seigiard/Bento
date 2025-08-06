import type { RaindropCollection } from '../services/raindrop/raindrop-schemas'
import { useStore } from '@nanostores/preact'
import { $openCategories, toggleCategory } from '../nanostores/category-state'
import { NestedCategories } from './NestedCategories'

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
        <span class="text-xl flex-shrink-0 w-6 h-6 flex place-content-center">
          {collection.cover && collection.cover.length > 0 ? (
       			<img
        				src={collection.cover[0]}
        				alt={collection.title}
        				class="w-full h-full object-cover rounded flex-shrink-0"
       			/>
          ) : (
      		  <>📁</>
         	)}
        </span>
        {collection.title}
      </h2>
      {isOpen && (
        <>
          <span class="pl-6 text-sm opacity-60">{collection.count} items</span>
          <NestedCategories parentId={collection._id} />
        </>
      )}
    </>
  )
}
