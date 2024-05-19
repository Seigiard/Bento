import { persistentAtom } from '@nanostores/persistent';

import { getElement } from '../helpers/getElement';

type ThemeType = 'light' | 'dark' | 'system'
const themeList: ThemeType[] = ['light', 'dark', 'system'];

export const $theme = persistentAtom<ThemeType>('systemTheme', 'system', {
  encode: JSON.stringify,
  decode: JSON.parse,
})

function switchNextTheme() {
  const theme = $theme.get();
  const currentThemeId = themeList.indexOf(theme) || 0;
  const nextTheme = themeList[(currentThemeId + 1) % themeList.length];
  $theme.set(nextTheme);
}

getElement('#themeButton')?.addEventListener('click', () => {
  switchNextTheme();
});

function switchTheme(theme: ThemeType) {
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
