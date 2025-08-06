import type { RaindropItem } from '../services/raindrop/raindrop-schemas'
import { useStore } from '@nanostores/preact'
import { $raindropApi } from '../nanostores/raindrop-api'
import { Link } from './Link'
import { useAsyncDataFetch } from '../hooks/useAsyncDataFetch'

interface CategoryLinksProps {
  categoryId: number
}

export function CategoryLinks({ categoryId }: CategoryLinksProps) {
  const raindropApi = useStore($raindropApi)

  const { data: raindrops, isLoading, error, refetch } = useAsyncDataFetch<RaindropItem[]>(
    async () => {
      if (!raindropApi) throw new Error('API not available')
      return await raindropApi.getRaindrops(categoryId)
    },
    { enabled: !!raindropApi }
  )

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return (
      <div class="pl-6 py-2">
        <div class="alert alert-error alert-sm">
          <span>{error}</span>
          <button
            class="btn btn-ghost btn-xs"
            onClick={refetch}
          >
            Retry
          </button>
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
