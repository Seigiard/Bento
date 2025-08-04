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
