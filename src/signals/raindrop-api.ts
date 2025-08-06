import { signal } from '@preact/signals'
import { CachedRaindropAPI } from '../services/raindrop/cached-raindrop-api'
import { RaindropAPI } from '../services/raindrop/raindrop-api'
import { $settings } from '../nanostores/settings'

export const raindropApi = signal<CachedRaindropAPI | null>(null)

// Initialize API when settings change
$settings.subscribe((settings) => {
  const key = settings.raindropApiKey
  
  if (key) {
    const api = new RaindropAPI(key)
    raindropApi.value = new CachedRaindropAPI(api)
  } else {
    raindropApi.value = null
  }
})