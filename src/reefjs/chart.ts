import { signal } from 'reefjs';
import { updateSignal } from '../helpers/signal';
import { getChartData, defaultData } from '../helpers/chart';

// Create a signal
let data = signal(defaultData);

// Create a template function
export function readiness() {
  let { readiness } = data;
  return readiness;
}

function getData() {
  getChartData().then((chartData) => {
    updateSignal(data, chartData, defaultData);
  });
}

getData();
