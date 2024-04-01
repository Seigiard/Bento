import { signal } from 'reefjs';
import { getForecast, initialValue, defaultValue } from '../models/forecast';
import { updateSignal } from '../helpers/signal';

export const signalName = 'forecast';

// Create a signal
let data = signal(initialValue, signalName);

// Create a template function
export function forecast() {
  let { temperature, unit, description, icon } = data;
  return `
    <img
      src="${icon}"
      alt=""
    />
    <span>${temperature} °${unit}</span>
    ${description}
  `;
}

function updateData() {
  getForecast().then((weatherData) => {
    updateSignal(data, weatherData, defaultValue);
  });
}

updateData();
const timeIntervalId = setInterval(updateData, 1000 * 60 * 60);
