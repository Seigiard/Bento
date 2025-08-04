export function getTime(): string {
  return Intl.DateTimeFormat(navigator.language || 'en-GB', {
    timeStyle: 'short',
  }).format();
}

