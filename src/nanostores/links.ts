import { onMount, task } from 'nanostores'
import { lsAtom } from '../helpers/lsAtom'
import { LinkType, TTL_TIME, defaultValue, getLinks } from '../models/links'

export const $lastFetchTimestamp = lsAtom<number>('linksLastFetchTimestamp', 0)
export const $accessToken = lsAtom<string>('linksAccessToken', '')
export const $raindropCollectionId = lsAtom<string>('linksCollectionId', '')

export const $links = lsAtom<LinkType[]>('links', defaultValue)

onMount($links, () => {
  task(async () => {
    const lagTimeMs = new Date().getTime() - $lastFetchTimestamp.get()
    getLinksWithLag(TTL_TIME < lagTimeMs ? TTL_TIME : lagTimeMs)
  })
})

function getLinksWithLag(lagTimeMs: number = 0) {
  setTimeout(async () => {
    $lastFetchTimestamp.set(new Date().getTime())
    const accessToken = $accessToken.get()
    const collectionId = $raindropCollectionId.get()

    if (!accessToken || !collectionId) {
      return
    }

    const data = await getLinks(accessToken, collectionId)
    $links.set(data)

    getLinksWithLag(0)
  }, TTL_TIME - lagTimeMs)
}