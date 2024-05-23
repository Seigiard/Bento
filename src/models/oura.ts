import { Interpolation, LineChartData, LineChartOptions } from 'chartist';
import { OuraClient } from '../helpers/oura';

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

export const TTL_TIME = 1000 * 60 * 60 * 4; // 4 hour

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

function getChartistOptions() {
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
      labelInterpolationFnc: (value: string) => value.split('-').slice(1).join('/'),
      showGrid: false,
    },
    axisY: {
      labelInterpolationFnc: (value: string) => gridLineTitles[value] ?? value,
    },
  };
}

export async function getChartData(accessToken: string) {
  return getOuraData(accessToken).then(parseChartData);
}

function parseChartData(data: RawChartDataType): ChartDataType {
  const chartData = getChartistCharts(data);
  const chartOptions = getChartistOptions();

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



async function getOuraData(accessToken: string) {
  const client = new OuraClient(accessToken);

  const dailyReadinessRawData = await client.getDailyReadiness({
    start_date: getWeekAgoDate(),
    end_date: getTodayDate(),
  });

  const dailySleepRawData = await client.getDailySleep({
    start_date: getWeekAgoDate(),
    end_date: getTodayDate(),
  });

  const dataDailyReadiness = getScoreByData(dailyReadinessRawData, 'readiness');

  const dataDailyHrvBalance = getScoreByData(
    dailyReadinessRawData,
    'hrv_balance',
    (item) => item.contributors.hrv_balance
  );

  const dataDailySleep = getScoreByData(dailySleepRawData, 'sleep');

  return mergeObjects(dataDailyReadiness, dataDailyHrvBalance, dataDailySleep);
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getWeekAgoDate() {
  var date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().slice(0, 10);
}

function getScoreByData(data, key, field = 'score') {
  function getValueByField(item) {
    if (typeof field === 'function') {
      return field(item);
    }
    return item[field];
  }

  return data.data
    .map((item) => ({
      day: item.day,
      value: getValueByField(item),
    }))
    .reduce((acc, item) => {
      acc[item.day] = { [key]: item.value };
      return acc;
    }, {});
}

function mergeObjects(...objs) {
  const keys = Object.keys(objs[0]);

  return keys.reduce((acc, key) => {
    acc[key] = objs.reduce((obj, item) => {
      return { ...obj, ...item[key] };
    }, {});
    return acc;
  }, {});
}