import type { RaindropCollection } from '../services/raindrop/raindrop-schemas'

interface CategoryProps {
  collection: RaindropCollection
}

export function Category({ collection }: CategoryProps) {
  return (
    <div class="collection-block">
      <h3>{collection.title}</h3>
      <p>
        {collection.count}
        {' '}
        items
      </p>
    </div>
  )
}