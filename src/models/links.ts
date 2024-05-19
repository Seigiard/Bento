const ENDPOINT = 'https://long-rose-salmon-sock.cyclic.app/raindrop';

export type LinkType = {
  title: string;
  link: string;
};

export const defaultValue: LinkType[] = [];

export async function getLinks() {
  return fetch(ENDPOINT).then((r) => r.json());
}
