// import { createApp } from 'vue';
// import App from './components/App.vue';
// import Icon from './components/Icon.vue';

// const app = createApp(App);
// app.component('Icon', Icon);
// app.mount('#app');

import CONFIG from '../config';
import { onConnect, onDisconnect } from '@reatom/framework';
import { atom } from '@reatom/core';

const timeAtom = atom('--:--', 'time');
const dateAtom = atom('--- --', 'date');
const greetings = atom('', 'greetings');

let timeIntervalId;

onConnect(timeAtom, (ctx) => {
  timeIntervalId = setInterval(() => {
    timeAtom(ctx, getTime());
    dateAtom(ctx, getDate());
    greetings(ctx, getGreeting());
  }, 1000);
});
onDisconnect(timeAtom, () => {
  clearInterval(timeIntervalId);
});

function getTime() {
  return Intl.DateTimeFormat(navigator.language || 'en-GB', {
    timeStyle: 'short',
  }).format();
}

function getDate() {
  return Intl.DateTimeFormat(navigator?.language || 'en-GB', {
    month: 'short',
    day: 'numeric',
  }).format();
}

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

export { timeAtom, dateAtom, greetings };
