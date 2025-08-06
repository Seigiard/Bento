import type { RaindropCollection } from './services/raindrop/raindrop-schemas'
import { signal } from '@preact/signals'
import { useEffect, useState } from 'preact/hooks'
import { $settings } from './nanostores/settings'
import { CachedRaindropAPI } from './services/raindrop/cached-raindrop-api'
import { RaindropAPI } from './services/raindrop/raindrop-api'

const raindropApi = signal<CachedRaindropAPI | null>(null)
const rootCollections = signal<RaindropCollection[]>([])
const isLoading = signal(false)
const error = signal<string | null>(null)

export function App() {
  const [apiKey, setApiKey] = useState<string>('')

  useEffect(() => {
    const unsubscribe = $settings.subscribe((settings) => {
      const key = settings.raindropApiKey
      setApiKey(key)

      if (key) {
        const api = new RaindropAPI(key)
        raindropApi.value = new CachedRaindropAPI(api)
        loadRootCollections()
      }
      else {
        raindropApi.value = null
        rootCollections.value = []
      }
    })

    return () => unsubscribe()
  }, [])

  async function loadRootCollections() {
    if (!raindropApi.value)
      return

    isLoading.value = true
    error.value = null

    try {
      const collections = await raindropApi.value.getRootCollections()
      rootCollections.value = collections
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load collections'
      console.error('Failed to load collections:', err)
    }
    finally {
      isLoading.value = false
    }
  }

  return (
    <div class="app">
      <h1>Bento - Raindrop Collections</h1>

      {!apiKey && (
        <div class="warning">
          Please set your Raindrop API key in settings
        </div>
      )}

      {isLoading.value && (
        <div class="loading">Loading collections...</div>
      )}

      {error.value && (
        <div class="error">
          Error:
          {' '}
          {error.value}
          <button onClick={loadRootCollections}>Retry</button>
        </div>
      )}

      {rootCollections.value.length > 0 && (
        <div class="collections-grid">
          {rootCollections.value.map(collection => (
            <div key={collection._id} class="collection-block">
              <h3>{collection.title}</h3>
              <p>
                {collection.count}
                {' '}
                items
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
