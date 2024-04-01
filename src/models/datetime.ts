import CONFIG from '../config';

export type DateTimeType = {
  date: string;
  time: string;
  greetings: string;
  name: string;
};

export const defaultValue: DateTimeType = {
  date: '--- --',
  time: '--:--',
  greetings: '',
  name: CONFIG.name,
};

export function getTime(): string {
  return Intl.DateTimeFormat(navigator.language || 'en-GB', {
    timeStyle: 'short',
  }).format();
}

export function getDate(): string {
  return Intl.DateTimeFormat(navigator?.language || 'en-GB', {
    month: 'short',
    day: 'numeric',
  }).format();
}

export function getGreetings(): string {
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
