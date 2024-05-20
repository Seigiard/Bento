export type LinkType = {
  title: string;
  link: string;
};

export const TTL_TIME = 1000 * 60 * 60 * 6 // 6 hours

export const defaultValue: LinkType[] = [];

export async function getLinks(accessToken: string, collectionId: string) {
  const response = await fetch(
    `https://api.raindrop.io/rest/v1/raindrops/${collectionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  return data.items.sort(sortItems).map(getSimpleData);
}

function sortItems(a, b) {
  return b.sort - a.sort;
}

function getSimpleData(item) {
  return {
    title: item.title,
    link: item.link,
  };
}