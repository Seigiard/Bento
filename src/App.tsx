import { $settings } from './nanostores/settings'
import { Settings } from './components/Settings'
import { Collection } from './components/Collection'
import { useStore } from '@nanostores/preact'
import { CategoryCardSkeleton } from './components/Skeleton';
import { $raindropCollections } from './nanoquery/raindrop-collections-fetcher';
import { $cacheReady } from './nanoquery/cache';

export function App() {
  return (
    <main class='p-6 w-dvw bg-base-200 h-dvh gap-8 overflow-x-scroll [column-count:auto] [column-width:clamp(20rem,25vw,23rem)] [column-fill:auto]'>
      <AppLoader />
      <Settings />
    </main>
  )
}

function AppLoader() {
  const cacheReady = useStore($cacheReady)
  const { raindropApiKey } = useStore($settings)

  if(!cacheReady) {
    return <CategoryCardSkeleton />
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
  const { loading, data: collections, error } = useStore($raindropCollections)

  if (!collections?.length && loading) {
    return <CategoryCardSkeleton />
  }

  if (error) {
    return (
      <div class="alert alert-error">
        Error loading categories: {error.message}
      </div>
    )
  }

  return collections?.map((collection) => (
    <Collection key={collection._id} collection={collection} />
  ))
}
