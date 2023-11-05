<template>
  <div class="weatherBlock">
    <Date />
    <Weather />
  </div>
</template>

<style>
.weatherBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>

<script>
import Date from './Date.vue';
import Weather from './Weather.vue';

export default {
  components: {
    Date,
    Weather,
  },
};
</script>
