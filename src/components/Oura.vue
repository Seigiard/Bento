<template>
  <div class="oura">
    <Line v-if="loaded" :data="chartData" :options="options" />
    <div class="ouraStats">
      <div class="card ouraStat">
        <strong>{{ readiness }}</strong
        >Readiness
      </div>
      <div class="card ouraStat">
        <strong>{{ sleep }}</strong
        >Sleep
      </div>
      <div class="card ouraStat">
        <strong>{{ hrv }}</strong
        >HVR
      </div>
    </div>
    <div class="stats"></div>
  </div>
</template>

<style>
.oura canvas {
  width: 100%;
  height: 28vh;
  margin-left: -4vh;
  margin-top: -1vh;
}

.ouraStats {
  width: 100%;
  display: flex;
  flex-direction: row;
  grid-gap: 5vh;
  padding: 3vh 0 0;
}

.ouraStat {
  flex-basis: 33.33%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 3vh 0;
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
import { bgPlugin, colors, chartOptions } from './Oura.chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const STEP = 40;
export default {
  data() {
    return {
      loaded: false,
      options: chartOptions,
      rawData: {},
    };
  },
  components: {
    Line,
  },
  async mounted() {
    await fetch('https://long-rose-salmon-sock.cyclic.app/')
      .then((r) => r.json())
      .then((data) => {
        this.rawData = data;
        this.loaded = true;
      });
    this.loaded = true;
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
      return this.chartReadinessData.slice(-1)[0];
    },
    sleep() {
      return this.chartSleepData.slice(-1)[0];
    },
    hrv() {
      return this.chartHrvBalanceData.slice(-1)[0];
    },
  },
};
</script>
