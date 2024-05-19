import { removeLoader } from './helpers/loader';
import { renderText } from './helpers/renderText';
import { $date } from './nanostores/date';
import { $forecast } from './nanostores/forecast';
import { $greetings } from './nanostores/greetings';
import { $links } from './nanostores/links';
import { $oura } from './nanostores/oura';
import { $time } from './nanostores/time';
import { renderChart } from './views/chart';
import { getForecastView } from './views/forecast';
import { getLinksView } from './views/links';

$oura.subscribe(({ chart, options }) => {
  renderChart(chart, options);
})

$oura.subscribe(({ readiness }) => {
  renderText('#readiness', readiness);
  removeLoader('#readiness');
})
$oura.subscribe(({ sleep }) => {
  renderText('#sleep', sleep);
  removeLoader('#sleep');
})
$oura.subscribe(({ hrv }) => {
  renderText('#hrv', hrv);
  removeLoader('#hrv');
})


$date.subscribe((date) => {
  renderText('#date', date);
  removeLoader('#date');
})
$time.subscribe((time) => {
  renderText('#time', time);
  removeLoader('#time');
})
$greetings.subscribe((greetings) => {
  renderText('#greetings', greetings);
  removeLoader('#greetings');
})

$forecast.subscribe((forecast) => {
  const view = getForecastView(forecast);
  renderText('#forecast', view);
  removeLoader('#forecast');
})

$links.subscribe((links) => {
  const view = getLinksView(links)
  renderText('#links', view);
  view && removeLoader('#links');
})
