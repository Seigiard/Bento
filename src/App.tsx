import { $settings } from './nanostores/settings'
import { Settings } from './components/Settings'
import { Collection } from './components/Collection'
import { useStore } from '@nanostores/preact'
import { CategoryCardSkeleton } from './components/Skeleton';
import { $raindropCollections } from './nanoquery/raindrop-collections-fetcher';
import { $cacheReady } from './nanoquery/cache';
import { EditMode } from './components/EditMode';
import { ThemeButton } from './components/ThemeButton';
import { $isOnline } from './nanostores/offline';

export function App() {
  const isOnline = useStore($isOnline);

  return (
    <div className='grid w-dvw h-dvh grid-cols-[1fr_min-content]'>
      {!isOnline && (
        <div class="alert alert-warning fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728"></path>
          </svg>
          <span>Offline mode</span>
        </div>
      )}
      <main class='p-6 w-full h-dvh gap-8 overflow-x-scroll snap-x [column-count:auto] [column-width:clamp(20rem,25vw,23rem)] [column-fill:auto]'>
        <AppLoader isOnline={isOnline} />
      </main>
      <aside className='border-l border-secondary/10 p-2 bg-base-300 flex flex-col justify-between gap-2'>
        <ThemeButton />
        <div className='flex flex-col gap-2'>
          <EditMode />
          <Settings />
        </div>
      </aside>
    </div>
  )
}

function AppLoader({ isOnline }: { isOnline: boolean }) {
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

  return <TheApp isOnline={isOnline} />
}

function TheApp({ isOnline }: { isOnline: boolean }) {
  const { loading, data: collections, error } = useStore($raindropCollections)

  if (!collections?.length && loading && isOnline) {
    return <CategoryCardSkeleton />
  }

  if (error && isOnline) {
    return (
      <div class="alert alert-error">
        Error loading categories: {error.message}
      </div>
    )
  }

  if (!collections?.length && !isOnline) {
    return (
      <div class="alert alert-info">
        <span>No cached data available offline. Connect to internet to load your bookmarks.</span>
      </div>
    )
  }

  return collections?.map((collection) => (
    <Collection key={collection._id} collection={collection} />
  ))
}
