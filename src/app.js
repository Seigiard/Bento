import { component } from 'reefjs';
import { date, time, greetings } from './reefjs/datetime';
import { forecast } from './reefjs/forecast';
import { readiness, sleep, hrv } from './reefjs/chart';
import { links } from './reefjs/links';

component('#date', date);
component('#time', time);
component('#greetings', greetings);

component('#forecast', forecast);

component('#readiness', readiness);
component('#sleep', sleep);
component('#hrv', hrv);

component('#links', links);
