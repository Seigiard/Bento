export function getDateTime(): string {
  return Intl.DateTimeFormat(navigator.language || 'en-GB', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format();
}
