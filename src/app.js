import { component } from 'reefjs';
import { onSignalRerender } from './helpers/signal';
import { removeLoader } from './helpers/loader';
import {
  signalName as datetimeSignalName,
  date,
  time,
  greetings,
} from './reefjs/datetime';
import { signalName as forecastSignalName, forecast } from './reefjs/forecast';
import {
  signalName as ouraSignalName,
  readiness,
  sleep,
  hrv,
  renderChart,
} from './reefjs/oura';
import { signalName as linksSignalName, links } from './reefjs/links';

component('#date', date, {
  signals: [datetimeSignalName],
});
component('#time', time, {
  signals: [datetimeSignalName],
});
component('#greetings', greetings, {
  signals: [datetimeSignalName],
});

component('#forecast', forecast, {
  signals: [forecastSignalName],
});

component('#readiness', readiness, {
  signals: [ouraSignalName],
});
component('#sleep', sleep, {
  signals: [ouraSignalName],
});
component('#hrv', hrv, {
  signals: [ouraSignalName],
});
renderChart();
onSignalRerender(ouraSignalName, renderChart);

component('#links', links, {
  signals: [linksSignalName],
});

removeLoader('#date');
removeLoader('#time');
removeLoader('#greetings');
removeLoader('#forecast');
removeLoader('#readiness');
removeLoader('#sleep');
removeLoader('#hrv');
removeLoader('#links');
