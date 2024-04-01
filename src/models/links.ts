import { LocalStorageConnector } from '../helpers/localStorage';

const ENDPOINT = 'https://long-rose-salmon-sock.cyclic.app/raindrop';
const LOCAL_STORAGE_KEY = 'raindrop';

export type LinkType = {
  title: string;
  link: string;
};

const lsData = new LocalStorageConnector(LOCAL_STORAGE_KEY);

export const defaultValue: LinkType[] = [];

export const initialValue: LinkType[] = lsData.get(defaultValue);

export function getLinks() {
  return fetchLinks().then(saveLinks);
}

function fetchLinks() {
  return fetch(ENDPOINT).then((r) => r.json());
}

function saveLinks(links) {
  lsData.set(links);
  return links;
}

export default {
  data() {
    return {
      links: lsData.get([]),
    };
  },
  async mounted() {
    this.links = await fetch('').then((r) => r.json());
    lsData.set(this.links);
  },
};
