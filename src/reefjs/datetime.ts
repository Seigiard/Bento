import CONFIG from '../config';
import { signal } from 'reefjs';
import { getGreetings, getDate, getTime } from '../helpers/datetime';

// Create a signal
let data = signal({
  date: '--- --',
  time: '--:--',
  greetings: '',
  name: CONFIG.name,
});

// Create a template function
export function date() {
  let { date } = data;
  return `${date}`;
}

export function time() {
  let { time } = data;
  return `${time}`;
}

export function greetings() {
  let { greetings, name } = data;
  if (!greetings) {
    return '';
  }
  return `${greetings}, ${name}!`;
}

function updateData() {
  data.time = getTime();
  data.date = getDate();
  data.greetings = getGreetings();
}

updateData();
const timeIntervalId = setInterval(updateData, 1000);
