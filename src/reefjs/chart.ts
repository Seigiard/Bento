import { signal } from 'reefjs';
import { updateSignal } from '../helpers/signal';
import { getChartData, defaultValue } from '../models/chart';

// Create a signal
let data = signal(defaultValue);

// Create a template function
export function readiness() {
  let { readiness } = data;
  return readiness;
}

export function sleep() {
  let { sleep } = data;
  return sleep;
}

export function hrv() {
  let { hrv } = data;
  return hrv;
}

function getData() {
  getChartData().then((chartData) => {
    updateSignal(data, chartData, defaultValue);
  });
}

getData();
