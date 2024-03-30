<template>
  <div class="oura">
    <div class="chart ct-chart ct-chart-proportion"></div>

    {{ hoveredLabel && activeLabel }}
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
import './Oura.css';
import { LineChart as LineChart } from 'chartist';
import {
  getChartistCharts,
  getChartistOptions,
  throttle,
} from './Oura.chart.js';
import { LocalStorageConnector } from '../libs/localStorage.js';

const LOCAL_STORAGE_KEY = 'oura';

const lsData = new LocalStorageConnector(LOCAL_STORAGE_KEY);

export default {
  data() {
    return {
      rawData: lsData.get({}),
      chart: null,
      hoveredLabel: null,
    };
  },
  async mounted() {
    this.rawData = await fetch(
      'https://long-rose-salmon-sock.cyclic.app/oura'
    ).then((r) => r.json());
    lsData.set(this.rawData);

    this.initChart(this.rawData);
  },
  updated() {
    this.updateChart(this.rawData);
  },
  methods: {
    onDraw(data) {
      if (data.type === 'point') {
        data.element._node.addEventListener(
          'mouseenter',
          throttle((e) => {
            this.hoverPoint(data.meta.label);
          }, 300)
        );

        // here we're listening for when the mouse leaves, and when it does
        // we add the class hidden to hide the tooltip.
        data.element._node.addEventListener('mouseleave', (e) => {
          this.hoverPoint();
        });
      }
    },
    hoverPoint(label) {
      this.hoveredLabel = label ?? null;
    },
    initChart(rawData) {
      this.chart = new LineChart(
        '.chart',
        getChartistCharts(rawData),
        getChartistOptions(rawData)
      ).on('draw', this.onDraw);
    },
    updateChart(rawData) {
      this.chart.update(
        getChartistCharts(rawData),
        getChartistOptions(rawData),
        { reset: true }
      );
    },
  },
  computed: {
    activeLabel() {
      return this.hoveredLabel ?? Object.keys(this.rawData).slice(-1)[0];
    },
    readiness() {
      return this.rawData[this.activeLabel]?.readiness ?? '--';
    },
    sleep() {
      return this.rawData[this.activeLabel]?.sleep ?? '--';
    },
    hrv() {
      return this.rawData[this.activeLabel]?.hrv_balance ?? '--';
    },
  },
};
</script>
