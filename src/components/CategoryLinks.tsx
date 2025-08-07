import { useStore } from '@nanostores/preact'
import { Link } from './Link'
import { createRaindropsStore } from '../nanoquery/raindrop-fetcher'
import { useState } from 'preact/hooks'

interface CategoryLinksProps {
  categoryId: number
}

export function CategoryLinks({ categoryId }: CategoryLinksProps) {
  const [$raindropStore] = useState(() => createRaindropsStore(categoryId))
  const { loading, data: raindrops, error } = useStore($raindropStore)

  if (loading) {
    return <Loader />
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
    <ul>
      {raindrops.map((raindrop) => (
        <Link key={raindrop._id} raindrop={raindrop} />
      ))}
    </ul>
  )
}

function Loader() {
  return (
    <div class="space-y-3 mt-2 ml-2">
      <div class="skeleton h-4 w-4/5"></div>
      <div class="skeleton h-4 w-3/5"></div>
      <div class="skeleton h-4 w-full"></div>
    </div>
  )
}
