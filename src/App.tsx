import { $settings } from './nanostores/settings'
import { Settings } from './components/Settings'
import { Collection } from './components/Collection'
import { useStore } from '@nanostores/preact'
import { CategoryCardSkeleton } from './components/Skeleton';
import { $raindropCollections } from './nanoquery/raindrop-collections-fetcher';
import { $cacheReady } from './nanoquery/cache';
import { EditMode } from './components/EditMode';
import { ThemeButton } from './components/ThemeButton';
import { $isOffline } from './nanostores/offline';
import { twMerge } from 'tailwind-merge';

export function App() {
  const isOffline = useStore($isOffline);

  return (
    <div className='grid w-dvw h-dvh grid-cols-[1fr_min-content]'>
      <main class='p-6 w-full h-dvh gap-8 overflow-x-scroll snap-x [column-count:auto] [column-width:clamp(20rem,25vw,23rem)] [column-fill:auto]'>
        <AppLoader />
      </main>
      <aside className='border-l border-secondary/10 p-2 bg-base-300 flex flex-col justify-between gap-2'>
        <div className='flex flex-col gap-2'>
          <ThemeButton />
          {isOffline && (
            <div className="tooltip tooltip-left" data-tip="We are Offline">
              <div className="btn btn-circle btn-warning cursor-default">
                <svg class="w-5 h-5">
                  <use href="#offlineIcon" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <EditMode />
          <Settings />
        </div>
      </aside>
    </div>
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
  const isOffline = useStore($isOffline);
  const { loading, data: collections, error } = useStore($raindropCollections)

  if (!collections?.length && loading && !isOffline) {
    return <CategoryCardSkeleton />
  }

  if (error && !isOffline) {
    return (
      <div class="alert alert-error">
        Error loading categories: {error.message}
      </div>
    )
  }

  if (!collections?.length && isOffline) {
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
