import { Interpolation, LineChartData, LineChartOptions } from 'chartist';

const ENDPOINT = 'https://long-rose-salmon-sock.cyclic.app/oura';

type RawChartDataType = Record<
  string,
  {
    readiness: number;
    sleep: number;
    hrv: number;
  }
>;

type ChartDataType = {
  chart: LineChartData;
  options: LineChartOptions;
  rawData: RawChartDataType;
  readiness: number | string;
  sleep: number | string;
  hrv: number | string;
};

export const defaultData: ChartDataType = {
  chart: {
    labels: [],
    series: [],
  },
  options: {},
  rawData: {},
  readiness: '--',
  sleep: '--',
  hrv: '--',
};

const gridLineTitles = {
  100: 'Optimal',
  85: 'Good',
  70: 'Fair',
  60: 'Ouch',
};

function getChartistCharts(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const valueKeys = Object.keys(values[0]);
  return {
    labels: labels,
    series: valueKeys.map((key) =>
      values.map((value, id) => ({
        meta: {
          key: id,
          label: labels[id],
          ...value,
        },
        value: value[key],
      }))
    ),
  };
}

function getChartistOptions(data) {
  return {
    // Remove this configuration to see that chart rendered with cardinal spline interpolation
    // Sometimes, on large jumps in data values, it's better to use simple smoothing.
    lineSmooth: Interpolation.simple({
      divisor: 2,
    }),
    chartPadding: { top: 10, right: 20, left: 50, bottom: 0 },
    fullWidth: true,
    showArea: false,
    axisX: {
      labelInterpolationFnc: (value) => value.split('-').slice(1).join('/'),
      showGrid: false,
    },
    axisY: {
      labelInterpolationFnc: (value) => gridLineTitles[value] ?? value,
    },
  };
}

function throttle(func, delay) {
  let lastExecutionTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecutionTime >= delay) {
      func.apply(this, args);
      lastExecutionTime = currentTime;
    }
  };
}

export function getChartData() {
  return fetchChartData().then(parseChartData);
}

function fetchChartData() {
  return fetch(ENDPOINT).then((r) => r.json());
}

function parseChartData(data): ChartDataType {
  const chartData = getChartistCharts(data);
  const chartOptions = getChartistOptions(data);

  const lastData = data[Object.keys(data)[0]];
  const readiness = lastData.readiness;
  const sleep = lastData.sleep;
  const hrv = lastData.hrv_balance;

  return {
    chart: chartData,
    options: chartOptions,
    rawData: data,
    readiness,
    sleep,
    hrv,
  };
}
