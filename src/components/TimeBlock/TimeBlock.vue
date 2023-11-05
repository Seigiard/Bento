<template>
  <div class="timeBlock">
    <Time></Time>
    <Greetings />
  </div>
</template>

<style>
.timeBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>

<script>
import Time from './Time.vue';
import Greetings from './Greetings.vue';

export default {
  components: {
    Time,
    Greetings,
  },
};
</script>
