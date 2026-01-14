import type { CollectionType } from "../schemas/raindrop-schemas";

import { CollectionLinks } from "./CategoryLinks";
import { NestedCollections } from "./NestedCollections";

interface CategoryProps {
  collection: CollectionType;
}

export function Collection({ collection }: CategoryProps) {
  return (
    <div>
      <h2 class="px-5 font-serif font-semibold text-lg">{collection.title}</h2>
      <ul class="px-2 pt-1">
        <CollectionLinks collectionId={collection._id} />
        <NestedCollections parentCollection={collection} />
      </ul>
    </div>
  );
}
