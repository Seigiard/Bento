import { persistentAtom } from '@nanostores/persistent'
import { onMount, task } from 'nanostores'
import { LinkType, defaultValue, getLinks } from '../models/links'

export const $links = persistentAtom<LinkType[]>('links', defaultValue, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

onMount($links, () => {
  task(async () => {
    const data = await getLinks()
    $links.set(data)
  })
})
