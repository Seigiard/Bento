import { onMount, task } from 'nanostores'
import { lsAtom } from '../helpers/lsAtom'
import { LinkType, TTL_TIME, defaultValue, getLinks } from '../models/links'

export const $lastFetchTimestamp = lsAtom<number>('linksLastFetchTimestamp', 0)
export const $accessToken = lsAtom<string>('linksAccessToken', '')
export const $raindropCollectionId = lsAtom<string>('linksCollectionId', '')

export const $links = lsAtom<LinkType[]>('links', defaultValue)

onMount($links, () => {
  task(async () => {
    const accessToken = $accessToken.get()
    const collectionId = $raindropCollectionId.get()

    if (!accessToken || !collectionId) {
      return
    }

    const lastFetchDiffMs = new Date().getTime() - $lastFetchTimestamp.get()

    if (TTL_TIME < lastFetchDiffMs) {
      const data = await getLinks(accessToken, collectionId)
      $links.set(data)
      $lastFetchTimestamp.set(new Date().getTime())
    }
  })
})
