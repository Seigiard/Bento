import { LinkType } from "../models/links";

export function getLinksView(data: LinkType[]) {
  if (!data.length) {
    return;
  }
  return data
    .map(({ title, link }) => {
      return `<li><a href="${link}">${title}</a></li>`;
    })
    .join('');
}
