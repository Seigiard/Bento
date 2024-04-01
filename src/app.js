import { component } from 'reefjs';
import { date, time, greetings } from './reefjs/datetime';
import { forecast } from './reefjs/forecast';
import { readiness } from './reefjs/chart';

component('#date', date);
component('#time', time);
component('#greetings', greetings);

component('#forecast', forecast);

component('#readiness', readiness);
