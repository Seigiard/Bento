import { Interpolation } from 'chartist';

const gridLineColors = {
  100: '#122F48',
  85: '#122F48',
  70: '#122F48',
  60: '#122F48',
};
const gridLineTitles = {
  100: 'Optimal',
  85: 'Good',
  70: 'Fair',
  60: 'Ouch',
};
const gridLines = Object.keys(gridLineColors);

export const colors = {
  readiness: '#6372DD',
  sleep: '#3B416C',
  hrv: '#6F3A3A',
};

export function getChartistCharts(data) {
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

export function getChartistOptions(data) {
  return {
    // Remove this configuration to see that chart rendered with cardinal spline interpolation
    // Sometimes, on large jumps in data values, it's better to use simple smoothing.
    lineSmooth: Interpolation.simple({
      divisor: 2,
    }),
    fullWidth: true,
    showArea: false,
    axisX: {
      showGrid: false,
    },
  };
}

export function throttle(func, delay) {
  let lastExecutionTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecutionTime >= delay) {
      func.apply(this, args);
      lastExecutionTime = currentTime;
    }
  };
}
