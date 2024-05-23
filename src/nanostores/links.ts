import { batched, task } from 'nanostores'
import { lsAtom } from '../helpers/lsAtom'
import { LinkType, TTL_TIME, defaultValue, getLinks } from '../models/links'
import { $settings } from './settings'

export const $links = lsAtom<LinkType[]>('links', defaultValue)

export const $lastFetchTimestamp = lsAtom<number>('linksLastFetchTimestamp', 0)

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
    data && $links.set(data)
  } catch (e) {
    console.error(e)
  }
  $lastFetchTimestamp.set(new Date().getTime())
}