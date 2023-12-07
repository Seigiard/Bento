<template>
  <div class="greetings">
    <span>{{ greetings }}, {{ name }}!</span>
  </div>
</template>

<style>
.greetings {
  font-size: var(--fg-secondary);
}
</style>

<script>
import CONFIG from '../../config';

export default {
  data() {
    return {
      name: CONFIG.name,
      greetings: getGreeting(),
    };
  },
};

function getGreeting() {
  const today = new Date();
  const hour = today.getHours();

  if (hour >= 23 || hour < 6) {
    return CONFIG.greetingNight;
  } else if (hour >= 6 && hour < 12) {
    return CONFIG.greetingMorning;
  } else if (hour >= 12 && hour < 17) {
    return CONFIG.greetingAfternoon;
  } else {
    return CONFIG.greetingEvening;
  }
}
</script>
