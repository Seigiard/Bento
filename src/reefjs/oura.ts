import { signal } from 'reefjs';
import { LineChart } from 'chartist';
import { updateSignal, onSignalRerender } from '../helpers/signal';
import { getChartData, defaultValue, ChartDataType } from '../models/oura';

export const signalName = 'chart';

// Create a signal
let data = signal(defaultValue, signalName);

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
    console.log('chartData', chartData);

    updateSignal(data, chartData, defaultValue);
  });
}

getData();

let chartChartist;

function renderChart() {
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
  chartChartist = new LineChart('#chart', chart, options); //.on('draw', this.onDraw);
}

function updateChart(
  chart: ChartDataType['chart'],
  options: ChartDataType['options']
) {
  chartChartist.update(chart, options, { reset: true });
}

onSignalRerender(signalName, renderChart);
