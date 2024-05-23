
import { SettingsValue } from './settings';

export function switchTheme(theme: SettingsValue['theme']) {
  const html = document.documentElement;

  if (theme === 'system') {
    html.classList.remove('is-dark', 'is-light');
  } else if (theme === 'light') {
    html.classList.remove('is-dark');
    html.classList.add('is-light');
  } else if (theme === 'dark') {
    html.classList.remove('is-light');
    html.classList.add('is-dark');
  }
}
