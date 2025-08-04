import { atom, onMount } from 'nanostores';
import { getDate } from '../models/datetime';

export const $date = atom<string>(getDate());

onMount($date, () => {
  const dateIntervalId = setInterval(() => $date.set(getDate()), 10 * 1000);
  return () => clearInterval(dateIntervalId);
});
