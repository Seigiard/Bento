<template>
  <div class="clock">
    <div class="time">{{ time }}</div>
  </div>
</template>

<style>
.clock {
  display: flex;
  align-items: center;
  justify-content: center;
}

.time {
  font-size: var(--fg-primary);
  font-weight: bolder;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>

<script>
export default {
  data() {
    return {
      interval: null,
      time: getTime(),
    };
  },
  beforeDestroy() {
    // prevent memory leak
    clearInterval(this.interval);
  },
  created() {
    // update the time every 5 second
    this.interval = setInterval(() => {
      this.time = getTime();
    }, 5 * 1000);
  },
};

function getTime() {
  return Intl.DateTimeFormat(navigator.language || 'en-GB', {
    timeStyle: 'short',
  }).format();
}
</script>
