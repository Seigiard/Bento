import { atom, onMount } from 'nanostores'
import { getDateTime } from '../models/datetime'

export const $time = atom<string>(getDateTime())

onMount($time, () => {
  const timeIntervalId = setInterval(() => $time.set(getDateTime()), 1000)
  return () => clearInterval(timeIntervalId)
})
