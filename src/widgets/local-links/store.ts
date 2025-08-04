import { lsAtom } from '../../helpers/lsAtom';
import { LinkType, defaultValue } from './models';

export const $localLinks = lsAtom<LinkType[]>('localLinks', defaultValue);
