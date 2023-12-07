<template>
  <Theme />
  <div class="container">
    <!-- Clock and Greetings  -->
    <ContainerBlock position="1 / 1 / 3 / 4">
      <TimeBlock />
    </ContainerBlock>

    <!-- Date and Weather  -->
    <ContainerBlock position="1 / 4 / 3 / 7">
      <DateBlock />
    </ContainerBlock>

    <ContainerBlock position="3 / 1 / 6 / 4">
      <Oura />
    </ContainerBlock>

    <ContainerBlock position="3 / 4 / 6 / 7">
      <BlockLeft />
      <Raindrop />
    </ContainerBlock>
  </div>
</template>

<script>
import Theme from './Theme.vue';
import ContainerBlock from './ContainerBlock';
import TimeBlock from './TimeBlock/TimeBlock.vue';
import DateBlock from './DateBlock/DateBlock.vue';
import Oura from './Oura.vue';
import BlockLeft from './BlockLeft.vue';
import Raindrop from './Raindrop.vue';

export default {
  components: {
    Theme,
    ContainerBlock,
    TimeBlock,
    DateBlock,
    Oura,
    BlockLeft,
    Raindrop,
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
