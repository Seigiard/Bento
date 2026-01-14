import { useStore } from "@nanostores/preact";
import { twMerge } from "tailwind-merge";

import { Collection } from "./components/Collection";
import { EditMode } from "./components/EditMode";
import { Settings } from "./components/Settings";
import { CategoryCardSkeleton } from "./components/Skeleton";
import { ThemeButton } from "./components/ThemeButton";
import { $raindropCollections } from "./nanoquery/raindrop-collections-fetcher";
import { fetchAllLinks } from "./nanoquery/raindrops-fetcher";
import { $flatCategories } from "./nanostores/flat-categories";
import { $isOffline } from "./nanostores/offline";
import { $settings } from "./nanostores/settings";

$flatCategories.subscribe(fetchAllLinks);

export function App() {
  const isOffline = useStore($isOffline);

  return (
    <div className="grid min-h-svh grid-rows-[1fr_min-content] grid-cols-[1fr]">
      <aside className="border-b border-secondary/30 p-2 flex flex-row justify-between gap-2">
        <div>
          {isOffline && (
            <div
              className="btn btn-circle btn-warning cursor-default tooltip tooltip-bottom"
              data-tip="We are Offline"
            >
              <svg class="w-5 h-5">
                <use href="#offlineIcon" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <EditMode />
          <Settings />
          <ThemeButton />
        </div>
      </aside>
      <main
        class={twMerge(
          "p-6 gap-8 snap-x scroll-pl-6",
          "w-full h-full md:overflow-x-scroll overflow-y-scroll md:overflow-y-auto",
        )}
      >
        <AppLoader />
      </main>
    </div>
  );
}

function AppLoader() {
  const { raindropApiKey } = useStore($settings);

  if (!raindropApiKey) {
    return (
      <div class="alert alert-warning">
        <span>Please set your Raindrop API key in settings</span>
      </div>
    );
  }

  return <TheApp />;
}

function TheApp() {
  const isOffline = useStore($isOffline);
  const { loading, data: collections, error } = useStore($raindropCollections);

  if (!collections?.length && loading && !isOffline) {
    return <CategoryCardSkeleton />;
  }

  if (error && !isOffline) {
    return <div class="alert alert-error">Error loading categories: {error.message}</div>;
  }

  if (!collections?.length && isOffline) {
    return (
      <div class="alert alert-info">
        <span>No cached data available offline. Connect to internet to load your bookmarks.</span>
      </div>
    );
  }

  return collections?.map((collection) => (
    <Collection key={collection._id} collection={collection} />
  ));
}
