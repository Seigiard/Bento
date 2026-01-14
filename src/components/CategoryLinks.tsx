import { useStore } from "@nanostores/preact";

import { getRaindropsStore } from "../nanoquery/raindrops-fetcher";
import { type CollectionType } from "../schemas/raindrop-schemas";

import { Link } from "./Link";
import { LinksSkeleton } from "./Skeleton";

export function CollectionLinks({ collectionId }: { collectionId: CollectionType["_id"] }) {
  const $raindropStore = getRaindropsStore(collectionId);
  const { loading, data, error } = useStore($raindropStore);

  if (!data?.length && loading) {
    return <LinksSkeleton />;
  }

  if (error) {
    return (
      <div class="alert alert-error alert-sm">
        <span>{error.message}</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <span class="text-sm opacity-60">No links found</span>;
  }

  return (
    <>
      {data.map((raindrop) => (
        <Link key={raindrop._id} raindrop={raindrop} />
      ))}
    </>
  );
}
