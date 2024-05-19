import { atom, onMount } from 'nanostores';
import CONFIG from '../config';

export const $name = atom<string>(CONFIG.name)
