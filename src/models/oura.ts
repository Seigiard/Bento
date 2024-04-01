import { JSONable, LocalStorageConnector } from '../helpers/localStorage';
import { Interpolation, LineChartData, LineChartOptions } from 'chartist';

const ENDPOINT = 'https://long-rose-salmon-sock.cyclic.app/oura';
const LOCAL_STORAGE_KEY = 'links';

type RawChartDataType = Record<
  string,
  {
    readiness: number;
    sleep: number;
    hrv_balance: number;
  }
>;

export type ChartDataType = {
  chart: LineChartData;
  options: LineChartOptions;
  rawData: RawChartDataType;
  readiness: number | string;
  sleep: number | string;
  hrv: number | string;
};

const lsData = new LocalStorageConnector(LOCAL_STORAGE_KEY);

export const defaultValue: ChartDataType = {
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

export const initialValue = lsData.get(defaultValue as unknown as JSONable);

const gridLineTitles = {
  100: 'Optimal',
  85: 'Good',
  70: 'Fair',
  60: 'Ouch',
};

function getChartistCharts(data: RawChartDataType) {
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

function getChartistOptions(data: RawChartDataType) {
  return {
    // Remove this configuration to see that chart rendered with cardinal spline interpolation
    // Sometimes, on large jumps in data values, it's better to use simple smoothing.
    lineSmooth: Interpolation.simple({
      divisor: 2,
    }),
    chartPadding: { top: 10, right: 20, left: 35, bottom: 0 },
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
  return fetchChartData().then(parseChartData).then(saveChartData);
}

function fetchChartData() {
  return fetch(ENDPOINT).then((r) => r.json());
}

function parseChartData(data: RawChartDataType): ChartDataType {
  const chartData = getChartistCharts(data);
  const chartOptions = getChartistOptions(data);

  const lastData = Object.values(data).slice(-1)[0];
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

function saveChartData(data: ChartDataType) {
  lsData.set(data as unknown as JSONable);
  return data;
}
