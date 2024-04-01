import { signal } from 'reefjs';
import {
  getGreetings,
  getDate,
  getTime,
  defaultValue,
  DateTimeType,
} from '../models/datetime';
import { updateSignal } from '../helpers/signal';

export const signalName = 'datetime';

// Create a signal
let data = signal(defaultValue, signalName);

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
  const newData: Partial<DateTimeType> = {
    time: getTime(),
    date: getDate(),
    greetings: getGreetings(),
  };

  updateSignal(data, newData, defaultValue);
}

updateData();
const timeIntervalId = setInterval(updateData, 1000);
