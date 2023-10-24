<template>
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


  <div class="linksBlock" id="linksBlock">
    <BlockLeft />
    <BlockRight />
  </div>

</template>

<script>
  import Time from './Time.vue';
  import Date from './Date.vue';
  import Greetings from './Greetings.vue';
  import Weather from './Weather.vue';
  import BlockLeft from './BlockLeft.vue';
  import BlockRight from './BlockRight.vue';
  import Icon from './Icon.vue';

  export default {
    components: {
      Time,
      Date,
      Greetings,
      Weather,
      BlockLeft,
      BlockRight,
    }
  };
</script>
