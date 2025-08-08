import { logger } from '@nanostores/logger'
import { render } from 'preact'
import { App } from './App'
import { $collections } from './nanostores/collections'
import { $expandedCollections } from './nanostores/collection-states'
import { $userData, $rootCategories, $childCategories } from './nanoquery/raindrop-fetcher'

// navigator.serviceWorker.register(
//   new URL('./service-worker.js', import.meta.url),
//   {type: 'module'}
// );
//

const destroy = logger({
  'UserData': $userData,
  'Root Categories': $rootCategories,
  'Child Categories': $childCategories,
  'Collections': $collections,
  'CollectionStates': $expandedCollections,
})

const root = document.getElementById('app')
if (root) {
  render(<App />, root)
}
