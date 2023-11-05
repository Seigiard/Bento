import { color } from 'chart.js/helpers';

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

export const chartOptions = {
  plugins: {
    legend: false,
  },
  layout: {
    padding: 0,
  },
  scales: {
    x: {
      border: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
    y: {
      max: 100,
      suggestedMax: 100,
      border: {
        display: false,
      },
      grid: {
        lineWidth(context) {
          const valStr = context.tick.value.toString();
          if (!gridLines.includes(valStr)) {
            return 0;
          }
          return 1;
        },
        color: function (context) {
          const valStr = context.tick.value.toString();
          if (!gridLines.includes(valStr)) {
            return '#000000';
          }
          return gridLineColors[valStr];
        },
      },
      ticks: {
        // For a category axis, the val is the index so the lookup via getLabelForValue is needed
        callback: function (val) {
          const valStr = val.toString();
          if (!gridLines.includes(valStr)) {
            return '';
          }
          // return valStr;
          return gridLineTitles[valStr];
        },
        padding: 10,
        font: {
          family:
            "Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, system-ui, sans-serif",
          size: '14vh',
        },
      },
    },
  },
  animation: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  responsive: false,
  maintainAspectRatio: false,
};
