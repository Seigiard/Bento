import { batched } from 'nanostores';
import { removeLoader } from './helpers/loader';
import { renderText } from './helpers/renderText';
import { switchTheme } from './models/theme';
import { $date } from './nanostores/date';
import { $forecast } from './nanostores/forecast';
import { $greetings } from './nanostores/greetings';
import { $raindropLinks, $raindropCollectionTree } from './nanostores/raindrop-links';
import { $settings } from './nanostores/settings';
import { $time } from './nanostores/time';
import { getForecastView } from './views/forecast';
import { getRaindropLinksView, getRaindropCollectionTreeView } from './views/raindrop-links';
import { getSettingsForm } from './views/settings';

import './controller/settings';

$date.subscribe((date) => {
  renderText('#date', date);
  removeLoader('#date');
});
$time.subscribe((time) => {
  renderText('#time', time);
  removeLoader('#time');
});
$greetings.subscribe((greetings) => {
  renderText('#greetings', greetings);
  removeLoader('#greetings');
});

$forecast.subscribe((forecast) => {
  const view = getForecastView(forecast);
  const forecastElement = document.querySelector('#forecast') as HTMLElement;

  if (!view && forecastElement) {
    // Скрываем только если явно нет доступа к геолокации
    forecastElement.style.display = 'none';
  } else if (view && forecastElement) {
    // Показываем и обновляем если есть данные
    forecastElement.style.display = '';
    renderText('#forecast', view);
    removeLoader('#forecast');
  }
});

// Подписка на изменения древовидной структуры коллекций
$raindropCollectionTree.subscribe((collections) => {
  const view = getRaindropCollectionTreeView(collections);
  renderText('#links', view);
  view && removeLoader('.links-panel');
});

// Оставляем старую подписку для обратной совместимости (можно удалить в будущем)
// $raindropLinks.subscribe((links) => {
//   const view = getRaindropLinksView(links);
//   renderText('#links', view);
//   view && removeLoader('.links-panel');
// });

$settings.subscribe((settings) => {
  const view = getSettingsForm(settings);
  renderText('#settingsForm', view);
});

const $theme = batched($settings, ({ theme }) => theme);
$theme.subscribe((theme) => {
  switchTheme(theme);
});
