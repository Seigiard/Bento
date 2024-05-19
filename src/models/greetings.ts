import CONFIG from '../config';

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
