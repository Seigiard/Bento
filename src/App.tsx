import { $settings } from './nanostores/settings'
import { Settings } from './components/Settings'
import { Category } from './components/Category'
import { useStore } from '@nanostores/preact'
import { $collections } from './nanostores/raindrop';

export function App() {
  const { raindropApiKey } = useStore($settings)
  const { loading, data: collections, error } = useStore($collections)

  return (
    <div class="app">
      <Settings />
      <main class='p-6 w-dvw h-dvh gap-8 overflow-x-scroll [column-count:auto] [column-width:clamp(20rem,25vw,23rem)] [column-fill:auto]'>
        {!raindropApiKey && (
          <div class="alert alert-warning">
            <span>Please set your Raindrop API key in settings</span>
          </div>
        )}

        {loading && (
          <div class="loading loading-spinner loading-lg"></div>
        )}

        {error && (
          <div class="alert alert-error">
            <span>Error loading categories: {error.message}</span>
            <button 
              class="btn btn-ghost btn-sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && collections?.map((collection) => (
          <Category key={collection._id} collection={collection} />
        ))}
      </main>
    </div>
  )
}
