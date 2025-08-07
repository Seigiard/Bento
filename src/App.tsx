import { $settings } from './nanostores/settings'
import { Settings } from './components/Settings'
import { Category } from './components/Category'
import { useStore } from '@nanostores/preact'
import { $collections } from './nanostores/collections';
import { $fetcherReady } from './nanoquery/raindrop-fetcher';

export function App() {
  return (
    <main class='p-6 w-dvw h-dvh gap-8 overflow-x-scroll [column-count:auto] [column-width:clamp(20rem,25vw,23rem)] [column-fill:auto]'>
      <AppLoader />
      <Settings />
    </main>
  )
}

function AppLoader() {
  const fetcherReady = useStore($fetcherReady)
  const { raindropApiKey } = useStore($settings)

  if(!fetcherReady) {
    return <div>Loading...</div>
  }

  if(!raindropApiKey) {
    return (
        <div class="alert alert-warning">
          <span>Please set your Raindrop API key in settings</span>
        </div>
    )
  }

  return <TheApp />
}

function TheApp() {
  const { loading, data: collections, error } = useStore($collections)

  return (
    <>
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
    </>
  )
}
