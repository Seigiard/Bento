<template>
  <Theme />
  <div class="container">
    <!-- Clock and Greetings  -->
    <ContainerBlock position="1 / 1 / 3 / 4">
      <div class="timeBlock">
        <Time></Time>
        <div id="greetings"><Greetings /></div>
      </div>
    </ContainerBlock>

    <!-- Date and Weather  -->
    <ContainerBlock position="1 / 4 / 3 / 7">
      <div class="weatherBlock">
        <Date />
        <Weather />
      </div>
    </ContainerBlock>

    <ContainerBlock position="3 / 1 / 6 / 4">
      <Oura />
    </ContainerBlock>
    <ContainerBlock position="3 / 4 / 6 / 7">
      <BlockLeft />
      <BlockRight />
    </ContainerBlock>
  </div>
</template>

<script>
import Theme from './Theme.vue';
import ContainerBlock from './ContainerBlock';
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
    ContainerBlock,
    Time,
    Date,
    Greetings,
    Weather,
    BlockLeft,
    BlockRight,
    Oura,
  },
  setup() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(
        new URL('../service-worker.js', import.meta.url),
        { type: 'module' }
      );
    }
    return {};
  },
};
</script>
