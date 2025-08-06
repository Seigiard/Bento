import type { RaindropCollection } from './services/raindrop/raindrop-schemas'
import { signal } from '@preact/signals'
import { For } from "@preact/signals/utils";
import { $settings } from './nanostores/settings'
import { CachedRaindropAPI } from './services/raindrop/cached-raindrop-api'
import { RaindropAPI } from './services/raindrop/raindrop-api'
import { Settings } from './components/Settings'
import { Category } from './components/Category'
import { useStore } from '@nanostores/preact'

const raindropApi = signal<CachedRaindropAPI | null>(null)
const rootCollections = signal<RaindropCollection[]>([])
const isLoading = signal(false)
const error = signal<string | null>(null)

$settings.subscribe((settings) => {
  const key = settings.raindropApiKey

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

export function App() {
  const { raindropApiKey } = useStore($settings)

  return (
    <div class="app">
      <Settings />
      <main class='p-6 w-dvw h-dvh gap-8 overflow-x-scroll [column-count:auto] [column-width:clamp(20rem,25vw,23rem)] [column-fill:auto]'>
        {!raindropApiKey && (
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

        <For each={rootCollections}>
          {(collection, index) =>  <Category key={collection._id} collection={collection} />}
        </For>
      </main>
    </div>
  )
}
