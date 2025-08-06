import type { RaindropItem } from '../services/raindrop/raindrop-schemas'

interface LinkProps {
  raindrop: RaindropItem
}

export function Link({ raindrop }: LinkProps) {
  return (
    <li>
      <a
				href={raindrop.link}
				rel="noopener noreferrer"
				class="block p-2 rounded hover:bg-base-200 transition-colors"
			>
				<div class="flex-1 min-w-0">
					<h3 class=" text-gray-900 group-hover:text-blue-600 truncate">
						{raindrop.title}
					</h3>
					{raindrop.domain && (
						<p class="text-xs text-gray-400">
							{raindrop.domain}
						</p>
					)}
				</div>
			</a>
    </li>
  )
}
