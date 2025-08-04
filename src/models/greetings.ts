export const TTL_TIME = 1000 * 60 * 60; // 1 hour

export function getGreetings({
  greetingNight,
  greetingMorning,
  greetingAfternoon,
  greetingEvening,
}): string {
  const today = new Date();
  const hour = today.getHours();

  if (hour >= 23 || hour < 6) {
    return greetingNight;
  } else if (hour >= 6 && hour < 12) {
    return greetingMorning;
  } else if (hour >= 12 && hour < 17) {
    return greetingAfternoon;
  } else {
    return greetingEvening;
  }
}
