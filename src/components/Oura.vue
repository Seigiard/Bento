<template>
  <div class="oura">
    <div class="chart">
      <Line :data="chartData" :options="options" />
    </div>
    <div class="ouraStats">
      <div class="ouraStat">
        <strong>{{ readiness }}</strong
        >Readiness
      </div>
      <div class="ouraStat">
        <strong>{{ sleep }}</strong
        >Sleep
      </div>
      <div class="ouraStat">
        <strong>{{ hrv }}</strong
        >HVR
      </div>
    </div>
    <div class="stats"></div>
  </div>
</template>

<style>
.chart {
  width: 100%;
  margin-left: -3vmin;
  margin-top: -1vmin;
}
.oura canvas {
  width: 100%;
  height: 100%;
}

.ouraStats {
  width: 100%;
  display: flex;
  flex-direction: row;
  grid-gap: 5vmin;
  padding: 3vmin 5vmin 0;
}

.ouraStat {
  flex-basis: 33.33%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: var(--fg-ouraStat-secondary);
}

.ouraStat strong {
  display: block;
  font-weight: bold;
  font-size: var(--fg-ouraStat);
}
</style>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'vue-chartjs';
import { colors, chartOptions } from './Oura.chart.js';
import { LocalStorageConnector } from '../libs/localStorage.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const LOCAL_STORAGE_KEY = 'oura';

const lsData = new LocalStorageConnector(LOCAL_STORAGE_KEY);

export default {
  data() {
    return {
      options: chartOptions,
      rawData: lsData.get({}),
    };
  },
  components: {
    Line,
  },
  async mounted() {
    this.rawData = await fetch(
      'https://long-rose-salmon-sock.cyclic.app/oura'
    ).then((r) => r.json());
    lsData.set(this.rawData);
  },
  computed: {
    chartData() {
      return {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Readiness',
            data: this.chartReadinessData,
            borderColor: colors.readiness,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
          {
            label: 'Sleep',
            data: this.chartSleepData,
            borderColor: colors.sleep,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
          {
            label: 'HRV Balance',
            data: this.chartHrvBalanceData,
            borderColor: colors.hrv,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            borderWidth: 2,
            borderDash: [5, 5],
          },
        ],
      };
    },
    chartLabels() {
      return Object.keys(this.rawData);
    },
    chartReadinessData() {
      return Object.values(this.rawData).map((d) => d.readiness);
    },
    chartHrvBalanceData() {
      return Object.values(this.rawData).map((d) => d.hrv_balance);
    },
    chartSleepData() {
      return Object.values(this.rawData).map((d) => d.sleep);
    },
    readiness() {
      return this.chartReadinessData?.slice(-1)?.[0] ?? '--';
    },
    sleep() {
      return this.chartSleepData?.slice(-1)?.[0] ?? '--';
    },
    hrv() {
      return this.chartHrvBalanceData?.slice(-1)?.[0] ?? '--';
    },
  },
};
</script>
