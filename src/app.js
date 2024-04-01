import { component } from 'reefjs';
import { date, time, greetings } from './reefjs/datetime';
import { forecast } from './reefjs/forecast';
import {
  readiness,
  sleep,
  hrv,
  signalName as ouraSignalName,
} from './reefjs/oura';
import { links } from './reefjs/links';

component('#date', date);
component('#time', time);
component('#greetings', greetings);

component('#forecast', forecast);

component('#readiness', readiness, {
  signals: [ouraSignalName],
});
component('#sleep', sleep, {
  signals: [ouraSignalName],
});
component('#hrv', hrv, {
  signals: [ouraSignalName],
});

component('#links', links);
