import type { LinkType } from './models'
import { lsAtom } from '../../helpers/lsAtom'
import { defaultValue } from './models'

export const $localLinks = lsAtom<LinkType[]>('localLinks', defaultValue)
