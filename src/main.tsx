import { logger } from '@nanostores/logger'
import { render } from 'preact'
import { App } from './App'
import { $expandedCollections } from './nanostores/collection-states'
import { $raindropCollections } from './nanoquery/raindrop-collections-fetcher'

// navigator.serviceWorker.register(
//   new URL('./service-worker.js', import.meta.url),
//   {type: 'module'}
// );
//

const destroy = logger({
  '$raindropCollections': $raindropCollections,
  'CollectionStates': $expandedCollections,
})

const root = document.getElementById('app')
if (root) {
  render(<App />, root)
}
