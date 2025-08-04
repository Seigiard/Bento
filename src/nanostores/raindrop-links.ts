import { batched, task } from 'nanostores';
import { lsAtom } from '../helpers/lsAtom';
import {
  RaindropLinkType,
  RaindropCollectionTree,
  TTL_TIME,
  defaultValue,
  getCollectionTree,
  flattenTreeToLinks,
} from '../models/raindrop-links';
import { $settings } from './settings';

// Хранилище для древовидной структуры коллекций
export const $raindropCollectionTree = lsAtom<RaindropCollectionTree[]>(
  'raindropCollectionTree',
  defaultValue,
);

// Хранилище для плоского списка ссылок (для обратной совместимости)
export const $raindropLinks = lsAtom<RaindropLinkType[]>(
  'raindropLinks',
  [],
);

export const $lastFetchTimestamp = lsAtom<number>(
  'raindropLinksLastFetchTimestamp',
  0,
);

// Stringify the raindropApiKey to avoid unnecessary fetches (убираем raindropCollection, так как теперь получаем все коллекции)
const $raindropKeys = batched(
  [$settings, $lastFetchTimestamp],
  ({ raindropApiKey }, lastFetchTimestamp) =>
    JSON.stringify({
      raindropApiKey,
      lastFetchTimestamp,
    }),
);

$raindropKeys.subscribe((value) => {
  task(async () => {
    const { raindropApiKey, lastFetchTimestamp } = JSON.parse(value);

    if (!raindropApiKey) {
      return;
    }

    const lastFetchDiffMs = new Date().getTime() - lastFetchTimestamp;
    const timeout =
      TTL_TIME - lastFetchDiffMs < 0 ? 0 : TTL_TIME - lastFetchDiffMs;

    const timeoutId = setTimeout(async () => {
      await updateCollectionTreeData(raindropApiKey);
    }, timeout);
    return () => clearInterval(timeoutId);
  });
});

async function updateCollectionTreeData(raindropApiKey: string) {
  try {
    console.log('🔄 Обновляем данные Raindrop.io...');
    const collectionTree = await getCollectionTree(raindropApiKey);
    
    if (collectionTree && collectionTree.length > 0) {
      // Сохраняем древовидную структуру
      $raindropCollectionTree.set(collectionTree);
      
      // Создаем плоский список для обратной совместимости
      const flatLinks = flattenTreeToLinks(collectionTree);
      $raindropLinks.set(flatLinks);
      
      console.log(`✅ Загружено ${collectionTree.length} коллекций с ${flatLinks.length} ссылками`);
    }
  } catch (e) {
    console.error('❌ Ошибка при загрузке данных Raindrop.io:', e);
  }
  $lastFetchTimestamp.set(new Date().getTime());
}
