import { batched, task } from 'nanostores'
import { lsAtom } from '../helpers/lsAtom'
import { RaindropLinkType, TTL_TIME, defaultValue, getLinks } from '../models/raindrop-links'
import { $settings } from './settings'

export const $raindropLinks = lsAtom<RaindropLinkType[]>('raindropLinks', defaultValue)

export const $lastFetchTimestamp = lsAtom<number>('raindropLinksLastFetchTimestamp', 0)

// Stringify the raindropApiKey and raindropCollection to avoid unnecessary fetches
const $raindropKeys = batched([$settings, $lastFetchTimestamp], ({ raindropApiKey, raindropCollection }, lastFetchTimestamp) => JSON.stringify({
  raindropApiKey,
  raindropCollection,
  lastFetchTimestamp
}))

$raindropKeys.subscribe((value) => {
  task(async () => {
    const {
      raindropApiKey,
      raindropCollection,
      lastFetchTimestamp
    } = JSON.parse(value)

    if (!raindropApiKey || !raindropCollection) {
      return
    }

    const lastFetchDiffMs = new Date().getTime() - lastFetchTimestamp
    const timeout = TTL_TIME - lastFetchDiffMs < 0 ? 0 : TTL_TIME - lastFetchDiffMs

    const timeoutId = setTimeout(async () => {
      await updateLinksData(raindropApiKey, raindropCollection)
    }, timeout)
    return () => clearInterval(timeoutId)
  })
})

async function updateLinksData(raindropApiKey, raindropCollection) {
  try {
    const data = await getLinks(raindropApiKey, raindropCollection)
    data && $raindropLinks.set(data)
  } catch (e) {
    console.error(e)
  }
  $lastFetchTimestamp.set(new Date().getTime())
}
