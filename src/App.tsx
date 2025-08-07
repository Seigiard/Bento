import type { RaindropCollection } from './services/raindrop/raindrop-schemas'
import { For } from "@preact/signals/utils";
import { $settings } from './nanostores/settings'
import { Settings } from './components/Settings'
import { Category } from './components/Category'
import { useStore } from '@nanostores/preact'
import { $raindropApi } from './nanostores/raindrop-api'
import { useAsyncDataFetch } from './hooks/useAsyncDataFetch'
import { $collections } from './nanostores/raindrop';

export function App() {
  const { raindropApiKey } = useStore($settings)
  const raindropApi = useStore($raindropApi)
  const cols = useStore($collections)

  const { data: collections, isLoading, error, refetch } = useAsyncDataFetch<RaindropCollection[]>(
    async () => {
      if (!raindropApi) throw new Error('API not available')
      return await raindropApi.getRootCollections()
    },
    { enabled: !!raindropApi }
  )

  return (
    <div class="app">
      <Settings />
      <main class='p-6 w-dvw h-dvh gap-8 overflow-x-scroll [column-count:auto] [column-width:clamp(20rem,25vw,23rem)] [column-fill:auto]'>
        {!raindropApiKey && (
          <div class="warning">
            Please set your Raindrop API key in settings
          </div>
        )}

        {isLoading && (
          <div class="loading">Loading collections...</div>
        )}

        {error && (
          <div class="error">
            Error:
            {' '}
            {error}
            <button onClick={refetch}>Retry</button>
          </div>
        )}

        {collections && collections.map((collection) => (
          <Category key={collection._id} collection={collection} />
        ))}
      </main>
    </div>
  )
}
