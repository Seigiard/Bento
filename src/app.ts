import { batched } from 'nanostores';
import { removeLoader } from './helpers/loader';
import { renderText } from './helpers/renderText';
import { switchTheme } from './models/theme';
import {
  $raindropCollectionTree,
  $raindropLinks,
} from './nanostores/raindrop-links';
import { $settings } from './nanostores/settings';
import { $time } from './nanostores/time';
import { getRaindropCollectionTreeView } from './views/raindrop-links';
import { getSettingsForm } from './views/settings';

import './controller/settings';

$time.subscribe((time) => {
  renderText('#time', time);
  removeLoader('#time');
});

// Подписка на изменения древовидной структуры коллекций
$raindropCollectionTree.subscribe((collections) => {
  const view = getRaindropCollectionTreeView(collections);
  renderText('#links', view);
  view && removeLoader('.links-panel');
});

$settings.subscribe((settings) => {
  const view = getSettingsForm(settings);
  renderText('#settingsForm', view);
});

const $theme = batched($settings, ({ theme }) => theme);
$theme.subscribe((theme) => {
  switchTheme(theme);
});
