import { signal } from 'reefjs';
import { LineChart } from 'chartist';
import { updateSignal } from '../helpers/signal';
import {
  getChartData,
  defaultValue,
  initialValue,
  ChartDataType,
} from '../models/oura';

export const signalName = 'chart';

// Create a signal
let data = signal(initialValue, signalName);

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

let chartChartist;

export function renderChart() {
  const { chart, options } = data;

  if (!chartChartist) {
    initChart(chart, options);
  } else {
    updateChart(chart, options);
  }
}

function initChart(
  chart: ChartDataType['chart'],
  options: ChartDataType['options']
) {
  if (chart.series.length === 0) {
    return;
  }
  chartChartist = new LineChart('#chart', chart, options); //.on('draw', this.onDraw);
}

function updateChart(
  chart: ChartDataType['chart'],
  options: ChartDataType['options']
) {
  chartChartist.update(chart, options, { reset: true });
}
