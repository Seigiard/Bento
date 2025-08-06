import type { RaindropItem } from '../services/raindrop/raindrop-schemas'
import { useSignal, useSignalEffect } from '@preact/signals'
import { useStore } from '@nanostores/preact'
import { $raindropApi } from '../nanostores/raindrop-api'
import { Link } from './Link'

interface CategoryLinksProps {
  categoryId: number
}

export function CategoryLinks({ categoryId }: CategoryLinksProps) {
  const raindropApi = useStore($raindropApi)
  const raindrops = useSignal<RaindropItem[]>([])
  const isLoading = useSignal(false)
  const error = useSignal<string | null>(null)
  const hasLoaded = useSignal(false)

  useSignalEffect(() => {
    if (!hasLoaded.value && raindropApi) {
      loadRaindrops()
    }
  })

  async function loadRaindrops() {
    if (!raindropApi) return

    isLoading.value = true
    error.value = null

    try {
      const items = await raindropApi.getRaindrops(categoryId)
      raindrops.value = items
      hasLoaded.value = true
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load links'
      console.error('Failed to load raindrops:', err)
    }
    finally {
      isLoading.value = false
    }
  }

  if (isLoading.value) {
    return (
      <Loader />
    )
  }

  if (error.value) {
    return (
      <div class="pl-6 py-2">
        <div class="alert alert-error alert-sm">
          <span>{error.value}</span>
          <button
            class="btn btn-ghost btn-xs"
            onClick={loadRaindrops}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (raindrops.value.length === 0) {
    return (
      <div class="pl-6 py-2">
        <span class="text-sm opacity-60">No links found</span>
      </div>
    )
  }

  return (
      <ul>
        {raindrops.value.map((raindrop) => (
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
