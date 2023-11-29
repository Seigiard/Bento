<template>
  <div class="date">
    <div class="currentDay">{{ date }}</div>
  </div>
</template>

<style>
.date {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2vh;
}

.currentDay {
  font-size: var(--fg-date);
  font-weight: bold;
  color: var(--fg);
}
</style>

<script>
export default {
  data() {
    return {
      interval: null,
      date: getDate(),
    };
  },
  beforeDestroy() {
    // prevent memory leak
    clearInterval(this.interval);
  },
  created() {
    // update the time every 5 second
    this.interval = setInterval(() => {
      // Concise way to format time according to system locale.
      // In my case this returns "3:48:00 am"
      this.date = getDate();
    }, 5 * 1000);
  },
};

function getDate() {
  return Intl.DateTimeFormat(navigator?.language || 'en-GB', {
    month: 'short',
    day: 'numeric',
  }).format();
}
</script>
