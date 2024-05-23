
import { batched } from 'nanostores';
import { getElement } from '../helpers/getElement';
import { SettingsValue, themeList } from '../models/settings';
import { $settings } from '../nanostores/settings';

export const $theme = batched($settings, ({ theme }) => theme);

function switchNextTheme() {
  const theme = $theme.get();
  const currentThemeId = themeList.indexOf(theme) || 0;
  const nextTheme = themeList[(currentThemeId + 1) % themeList.length];
  $settings.setKey('theme', nextTheme);
}

getElement('#themeButton')?.addEventListener('click', () => {
  switchNextTheme();
});

function switchTheme(theme: SettingsValue['theme']) {
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

$theme.subscribe((theme) => {
  switchTheme(theme);
})
