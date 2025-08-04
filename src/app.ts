import { batched } from 'nanostores';
import { removeLoader } from './helpers/loader';
import { renderText } from './helpers/renderText';
import { switchTheme } from './models/theme';
import { $date } from './nanostores/date';
import { $forecast } from './nanostores/forecast';
import { $greetings } from './nanostores/greetings';
import { $raindropLinks } from './nanostores/raindrop-links';
import { $settings } from './nanostores/settings';
import { $time } from './nanostores/time';
import { getForecastView } from './views/forecast';
import { getRaindropLinksView } from './views/raindrop-links';
import { getSettingsForm } from './views/settings';

import './controller/settings';
import { initWidget as initLocalLinksWidget } from './widgets/local-links';

initLocalLinksWidget('#local-links');

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

$raindropLinks.subscribe((links) => {
  const view = getRaindropLinksView(links);
  renderText('#links', view);
  view && removeLoader('#links');
});

$settings.subscribe((settings) => {
  const view = getSettingsForm(settings);
  renderText('#settingsForm', view);
});

const $theme = batched($settings, ({ theme }) => theme);
$theme.subscribe((theme) => {
  switchTheme(theme);
});
