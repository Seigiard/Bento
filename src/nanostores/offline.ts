import { atom } from 'nanostores'

export const $isOnline = atom(navigator.onLine)

// Update store when online status changes
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    $isOnline.set(true)
  })

  window.addEventListener('offline', () => {
    $isOnline.set(false)
  })
}
