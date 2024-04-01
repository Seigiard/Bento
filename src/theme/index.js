import { store } from 'reefjs';
import { LocalStorageConnector } from '../helpers/localStorage';
import { onSignalRerender } from '../helpers/signal';

const LOCAL_STORAGE_KEY = 'theme';
const lsData = new LocalStorageConnector(LOCAL_STORAGE_KEY);

const signalName = 'theme';

const themeList = ['light', 'dark', 'system'];

const themeStore = store(
  { theme: lsData.get('system') },
  {
    // Add an item to the todo list
    switchNextTheme(data) {
      const currentThemeId = themeList.indexOf(data.theme) || 0;
      data.theme = themeList[(currentThemeId + 1) % themeList.length];
      lsData.set(data.theme);
    },
  },
  signalName
);

document.querySelector('#themeButton').addEventListener('click', () => {
  themeStore.switchNextTheme();
});

switchTheme(lsData.get('system'));
onSignalRerender(signalName, () => {
  switchTheme(themeStore.value.theme);
});

function switchTheme(theme) {
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
