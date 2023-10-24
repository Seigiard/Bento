<template>
  <div id="time">
    <div class="clock">
      <div class="time">{{time}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      interval: null,
      time: getTime()
    }
  },
  beforeDestroy() {
    // prevent memory leak
    clearInterval(this.interval)
  },
  created() {
    // update the time every 5 second
    this.interval = setInterval(() => {
      this.time = getTime()
    }, 5 * 1000)
  }
}

function getTime() {
  return Intl.DateTimeFormat(navigator.language, {
    hour: 'numeric',
    minute: 'numeric',
  }).format()
}
</script>