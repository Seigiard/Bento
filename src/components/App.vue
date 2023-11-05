<template>
  <Theme />
  <div class="container">
    <!-- Clock and Greetings  -->
    <div class="timeBlock">
      <Time></Time>
      <div id="greetings"><Greetings /></div>
    </div>

    <!-- Date and Weather  -->
    <div class="weatherBlock">
      <Date />
      <Weather />
    </div>

    <Oura />

    <BlockRight />
  </div>
</template>

<script>
import Theme from './Theme.vue';
import Time from './Time.vue';
import Date from './Date.vue';
import Greetings from './Greetings.vue';
import Weather from './Weather.vue';
import BlockLeft from './BlockLeft.vue';
import BlockRight from './BlockRight.vue';
import Oura from './Oura.vue';

export default {
  components: {
    Theme,
    Time,
    Date,
    Greetings,
    Weather,
    BlockLeft,
    BlockRight,
    Oura,
  },
};
</script>
