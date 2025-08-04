import { atom, onMount } from 'nanostores';
import { getTime } from '../models/datetime';

export const $time = atom<string>(getTime());

onMount($time, () => {
  const timeIntervalId = setInterval(() => $time.set(getTime()), 1000);
  return () => clearInterval(timeIntervalId);
});
