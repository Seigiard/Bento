import { useStore } from '@nanostores/preact'
import { Link } from './Link'
import { createRaindropsStore } from '../nanoquery/raindrops-fetcher'
import { useState } from 'preact/hooks'
import { LinksSkeleton } from './Skeleton'
import { type CollectionType } from '../schemas/raindrop-schemas'

export function CollectionLinks({ collectionId }: {
  collectionId: CollectionType['_id']
}) {
  const [$raindropStore] = useState(() => createRaindropsStore(collectionId))
  const { loading, data, error } = useStore($raindropStore)

  if (!data?.length && loading) {
    return <LinksSkeleton />
  }

  if (error) {
    return (
      <div class="alert alert-error alert-sm">
        <span>{error.message}</span>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <span class="text-sm opacity-60">No links found</span>
    )
  }

  return (
    <>
      {data.map((raindrop) => (
        <Link key={raindrop._id} raindrop={raindrop} />
      ))}
    </>
  )
}
