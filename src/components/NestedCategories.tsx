import type { RaindropCollection } from '../services/raindrop/raindrop-schemas'
import { useSignal, useSignalEffect } from '@preact/signals'
import { For } from "@preact/signals/utils"
import { Category } from './Category'
import { useStore } from '@nanostores/preact'
import { $raindropApi } from '../nanostores/raindrop-api'

interface NestedCategoriesProps {
  parentId: number
}

export function NestedCategories({ parentId }: NestedCategoriesProps) {
  const raindropApi = useStore($raindropApi)
  const childCollections = useSignal<RaindropCollection[]>([])
  const isLoading = useSignal(false)
  const error = useSignal<string | null>(null)
  const hasLoaded = useSignal(false)

  useSignalEffect(() => {
    if (!hasLoaded.value && raindropApi) {
      loadChildCollections()
    }
  })

  async function loadChildCollections() {
    if (!raindropApi) return

    isLoading.value = true
    error.value = null

    try {
      // Получаем дочерние коллекции для указанного parentId
      const collections = await raindropApi.getChildCollections(parentId)
      childCollections.value = collections
      hasLoaded.value = true
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load child collections'
      console.error('Failed to load child collections:', err)
    }
    finally {
      isLoading.value = false
    }
  }

  if (isLoading.value) {
    return (
      <div class="pl-6 py-2">
        <span class="loading loading-spinner loading-sm"></span>
        <span class="ml-2 text-sm opacity-60">Loading categories...</span>
      </div>
    )
  }

  if (error.value) {
    return (
      <div class="pl-6 py-2">
        <div class="alert alert-error alert-sm">
          <span>{error.value}</span>
          <button
            class="btn btn-ghost btn-xs"
            onClick={loadChildCollections}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <For each={childCollections}>
      {(collection) => <Category key={collection._id} collection={collection} />}
    </For>
  )
}
