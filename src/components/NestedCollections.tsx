import type { CollectionType } from '../schemas/raindrop-schemas'
import { CollectionLinks } from './CategoryLinks'

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
        <NestedCollection key={collection._id} collection={collection} />
      ))}
    </>
  )
}

function NestedCollection({ collection }: { collection: CollectionType }) {
  return (
    <>
      <li><h3 className='px-3 pt-4 pb-2 font-serif font-semibold text-md text-base text-base-content/60'>{collection.title}</h3></li>
      <CollectionLinks collectionId={collection._id} />
      {collection.children && collection.children.length > 0 && (
        <NestedCollections parentCollection={collection} />
      )}
    </>
  )
}
