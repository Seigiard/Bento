import { browser } from '$app/environment'
import { CachedRaindropAPI } from './cached-raindrop-api.js'
import { RaindropAPI } from './raindrop-api.js'

// API ключ - можно вынести в переменные окружения
const API_KEY = '40d66e19-8250-4b23-b314-72d5ecbdf116'

// Singleton instances для переиспользования
let raindropInstance: RaindropAPI | null = null
let cachedRaindropInstance: CachedRaindropAPI | null = null

function getRaindropAPI(): RaindropAPI {
  if (!raindropInstance) {
    raindropInstance = new RaindropAPI(API_KEY)
  }
  return raindropInstance
}

export function getCachedRaindropAPI(): CachedRaindropAPI {
  if (!cachedRaindropInstance) {
    const api = getRaindropAPI()
    cachedRaindropInstance = new CachedRaindropAPI(api)
  }
  return cachedRaindropInstance
}

// Проверка доступности API (только в браузере)
export function isRaindropAvailable(): boolean {
  return browser && !!API_KEY && API_KEY !== 'your_raindrop_api_key_here'
}
