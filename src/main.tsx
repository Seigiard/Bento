import { render } from 'preact'
import { App } from './App'

// navigator.serviceWorker.register(
//   new URL('./service-worker.js', import.meta.url),
//   {type: 'module'}
// );
//

const root = document.getElementById('app')
if (root) {
  render(<App />, root)
}
