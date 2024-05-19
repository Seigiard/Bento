import { atom, onMount } from 'nanostores';
import { getGreetings } from '../models/greetings';
import { $name } from './name';

export const $greetings = atom<string>(getGreetingsMessage())

onMount($greetings, () => {
  const intervalId = setInterval(() => $greetings.set(getGreetingsMessage()), 60 * 1000);
  return () => clearInterval(intervalId)
})

function getGreetingsMessage() {
  const message = getGreetings()
  const name = $name.get()
  if (!!name) {
    return `${message}, ${name}`
  }
  return message
}
