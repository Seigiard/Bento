import type { RaindropItemType } from "../schemas/raindrop-schemas";

interface LinkProps {
  raindrop: RaindropItemType;
}

export function Link({ raindrop }: LinkProps) {
  return (
    <li>
      <a
        href={raindrop.link}
        rel="noopener noreferrer"
        class="block -mx-3 py-2 px-3 group rounded hover:bg-base-100 outline-offset-0 outline-2 outline-transparent focus-visible:outline-accent transition-colors duration-200"
      >
        <div class="flex-1 min-w-0">
          <h3 class="text-base truncate">{raindrop.title}</h3>
          {raindrop.domain && <p class="text-xs text-gray-400">{raindrop.domain}</p>}
        </div>
      </a>
    </li>
  );
}
