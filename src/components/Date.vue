<template>
  <div class="date"><div class="currentDay">{{date}}</div></div>
</template>

<script>
export default {
  data() {
    return {
      interval: null,
      date: getDate()
    }
  },
  beforeDestroy() {
    // prevent memory leak
    clearInterval(this.interval)
  },
  created() {
    // update the time every 5 second
    this.interval = setInterval(() => {
      // Concise way to format time according to system locale.
      // In my case this returns "3:48:00 am"
      this.date = getDate()
    }, 5 * 1000)
  }
}

function getDate() {
  return Intl.DateTimeFormat(navigator?.language || 'en-GB', {
    month: 'short',
    day: 'numeric',
  }).format()
}
</script>