import { RaindropAPI, type RaindropCollection } from '../services/raindrop-api';

export type RaindropLinkType = {
  title: string;
  link: string;
};

export type RaindropCollectionTree = RaindropCollection;

export const TTL_TIME = 1000 * 60 * 60 * 6; // 6 hours

export const defaultValue: RaindropCollectionTree[] = [];

/**
 * Получить полную структуру коллекций и их raindrops
 */
export async function getCollectionTree(
  accessToken: string,
): Promise<RaindropCollectionTree[]> {
  if (!accessToken) {
    console.warn('No Raindrop.io access token provided');
    return [];
  }
  console.log(123);
  try {
    const api = new RaindropAPI(accessToken);
    const tree = await api.fetchAndPrintFullStructure();
    console.log(tree);
    return tree;
  } catch (error) {
    console.error('Error fetching Raindrop collection tree:', error);
    return [];
  }
}

/**
 * Получить плоский список всех ссылок из дерева коллекций (для обратной совместимости)
 */
export function flattenTreeToLinks(
  tree: RaindropCollectionTree[],
): RaindropLinkType[] {
  const links: RaindropLinkType[] = [];

  function extractLinks(collections: RaindropCollectionTree[]) {
    collections.forEach((collection) => {
      if (collection.raindrops) {
        collection.raindrops.forEach((raindrop) => {
          links.push({
            title: raindrop.title,
            link: raindrop.link,
          });
        });
      }

      if (collection.children) {
        extractLinks(collection.children);
      }
    });
  }

  extractLinks(tree);
  return links;
}

// Оставляем старую функцию для обратной совместимости
export async function getLinks(accessToken: string, collectionId: string) {
  const response = await fetch(
    `https://api.raindrop.io/rest/v1/raindrops/${collectionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return (data?.items ?? []).sort(sortItems).map(getSimpleData);
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
