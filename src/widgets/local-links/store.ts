import { lsAtom } from '../../helpers/lsAtom';
import { defaultValue, type LinkType } from './models';

export const $localLinks = lsAtom<LinkType[]>('localLinks', defaultValue);
