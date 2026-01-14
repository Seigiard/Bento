import { useStore } from "@nanostores/preact";
import { twMerge } from "tailwind-merge";

import { $pinnedCategories, togglePin } from "../nanostores/collection-states";
import type { CollectionType } from "../schemas/raindrop-schemas";

import { CollectionLinks } from "./CategoryLinks";
import { NestedCollections } from "./NestedCollections";

interface CategoryProps {
  collection: CollectionType;
}

export function Collection({ collection }: CategoryProps) {
  const pinnedIds = useStore($pinnedCategories);
  const categoryId = String(collection._id);
  const isPinned = pinnedIds.includes(categoryId);

  return (
    <div class="group">
      <h2 class="px-5 font-serif font-semibold text-lg flex items-center gap-2">
        <button
          onClick={() => togglePin(categoryId)}
          class={twMerge(
            "transition-opacity cursor-pointer",
            isPinned ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          aria-label={isPinned ? "Unpin category" : "Pin category"}
        >
          <svg class="w-4 h-4">
            <use href="#pinIcon" />
          </svg>
        </button>
        {collection.title}
      </h2>
      <ul class="px-2 pt-1">
        <CollectionLinks collectionId={collection._id} />
        <NestedCollections parentCollection={collection} />
      </ul>
    </div>
  );
}
