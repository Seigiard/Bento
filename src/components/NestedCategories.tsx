import type { RaindropCollection } from '../services/raindrop/raindrop-schemas'
import { Category } from './Category'
import { useStore } from '@nanostores/preact'
import { $raindropApi } from '../nanostores/raindrop-api'
import { useAsyncDataFetch } from '../hooks/useAsyncDataFetch'

interface NestedCategoriesProps {
  parentId: number
}

export function NestedCategories({ parentId }: NestedCategoriesProps) {
  const raindropApi = useStore($raindropApi)

  const { data: childCollections, isLoading, error, refetch } = useAsyncDataFetch<RaindropCollection[]>(
    async () => {
      if (!raindropApi) throw new Error('API not available')
      return await raindropApi.getChildCollections(parentId)
    },
    { enabled: !!raindropApi }
  )

  if (isLoading) {
    return (
      <div class="pl-6 py-2">
        <span class="loading loading-spinner loading-sm"></span>
        <span class="ml-2 text-sm opacity-60">Loading categories...</span>
      </div>
    )
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

  if (!childCollections || childCollections.length === 0) {
    return null
  }

  return (
    <div class="pl-6">
      {childCollections.map((collection) => (
        <Category key={collection._id} collection={collection} />
      ))}
    </div>
  )
}
