import { atom } from 'nanostores'
import { CachedRaindropAPI } from '../services/raindrop/cached-raindrop-api'
import { RaindropAPI } from '../services/raindrop/raindrop-api'
import { $settings } from './settings'

export const $raindropApi = atom<CachedRaindropAPI | null>(null)

// Initialize API when settings change
$settings.subscribe((settings) => {
  const key = settings.raindropApiKey
  
  if (key) {
    const api = new RaindropAPI(key)
    $raindropApi.set(new CachedRaindropAPI(api))
  } else {
    $raindropApi.set(null)
  }
})