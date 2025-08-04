import { RaindropLinkType } from '../models/raindrop-links';

export function getRaindropLinksView(data: readonly RaindropLinkType[]) {
  if (!data.length) {
    return;
  }
  return data
    .map(({ title, link }) => {
      return `<li><a href="${link}">${title}</a></li>`;
    })
    .join('');
}
