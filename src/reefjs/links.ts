import { signal } from 'reefjs';
import { updateSignal } from '../helpers/signal';
import { getLinks, initialValue } from '../models/links';

export const signalName = 'links';

// Create a signal
let data = signal(initialValue, signalName);

// Create a template function
export function links() {
  if (!data.length) {
    return null;
  }
  return data
    .map(({ title, link }) => {
      return `<li><a href="${link}">${title}</a></li>`;
    })
    .join('');
}

function getData() {
  getLinks().then((links) => {
    updateSignal(data, links, initialValue);
  });
}

getData();
