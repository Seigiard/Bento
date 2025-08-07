import { useStore } from '@nanostores/preact'
import { Link } from './Link'
import { createRaindropsStore } from '../nanoquery/raindrop-fetcher'
import { useState } from 'preact/hooks'
import { LinksSkeleton } from './Skeleton'

interface CategoryLinksProps {
  categoryId: number
}

export function CategoryLinks({ categoryId }: CategoryLinksProps) {
  const [$raindropStore] = useState(() => createRaindropsStore(categoryId))
  const { loading, data: raindrops, error } = useStore($raindropStore)

  if (loading) {
    return <LinksSkeleton />
  }

  if (error) {
    return (
      <div class="pl-6 py-2">
        <div class="alert alert-error alert-sm">
          <span>{error.message}</span>
        </div>
      </div>
    )
  }

  if (!raindrops || raindrops.length === 0) {
    return (
      <div class="pl-6 py-2">
        <span class="text-sm opacity-60">No links found</span>
      </div>
    )
  }

  return (
    <ul className='max-h-full overflow-y-scroll'>
      {raindrops.map((raindrop) => (
        <Link key={raindrop._id} raindrop={raindrop} />
      ))}
    </ul>
  )
}
