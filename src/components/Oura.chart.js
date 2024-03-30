import { Interpolation } from 'chartist';

const gridLineTitles = {
  100: 'Optimal',
  85: 'Good',
  70: 'Fair',
  60: 'Ouch',
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
