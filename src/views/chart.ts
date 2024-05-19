import { LineChart } from 'chartist';
import {
    ChartDataType,
} from '../models/oura';

let chartChartist: LineChart | undefined = undefined;

export function renderChart(
  chart: ChartDataType['chart'],
  options: ChartDataType['options']
) {
  if (!chart || !options) {
    return;
  }
  if (!chartChartist) {
    chartChartist = initChart(chart, options);
  } else {
    updateChart(chartChartist, chart, options);
  }
}


function initChart(
  chart: ChartDataType['chart'],
  options: ChartDataType['options']
) {
  if (chart.series.length === 0) {
    return;
  }
  return new LineChart('#chart', chart, options); //.on('draw', this.onDraw);
}

function updateChart(
  lineChart,
  chart: ChartDataType['chart'],
  options: ChartDataType['options']
) {
  lineChart.update(chart, options, { reset: true });
}
