/**
 * Тестовый файл для проверки работы RaindropAPI
 * Этот файл можно запустить отдельно для тестирования API
 */

import { RaindropAPI } from './services/raindrop-api';

async function testRaindropAPI() {
  // Замените на ваш реальный API ключ
  const apiKey = 'your-api-key-here';

  if (apiKey === 'your-api-key-here') {
    console.log(
      '❌ Пожалуйста, укажите ваш API ключ Raindrop.io в файле test-raindrop.ts',
    );
    return;
  }

  const api = new RaindropAPI(apiKey);

  try {
    console.log('🚀 Начинаем тестирование Raindrop.io API...\n');

    // Тестируем получение корневых коллекций
    console.log('1. Получаем корневые коллекции...');
    const rootCollections = await api.getRootCollections();
    console.log(`   Найдено ${rootCollections.length} корневых коллекций`);
    rootCollections.forEach((col) => {
      console.log(
        `   - ${col.title} (ID: ${col._id}, количество: ${col.count || 0})`,
      );
    });

    // Тестируем получение дочерних коллекций
    console.log('\n2. Получаем дочерние коллекции...');
    const childCollections = await api.getChildCollections();
    console.log(`   Найдено ${childCollections.length} дочерних коллекций`);
    childCollections.forEach((col) => {
      console.log(
        `   - ${col.title} (ID: ${col._id}, родитель: ${col.parent?.$id || 'нет'})`,
      );
    });

    // Тестируем получение raindrops для первой коллекции
    if (rootCollections.length > 0) {
      const firstCollection = rootCollections[0];
      console.log(
        `\n3. Получаем raindrops для коллекции "${firstCollection.title}"...`,
      );
      const raindrops = await api.getRaindrops(firstCollection._id, 5);
      console.log(`   Найдено ${raindrops.length} raindrops`);
      raindrops.forEach((raindrop) => {
        console.log(`   - ${raindrop.title}: ${raindrop.link}`);
      });
    }

    // Тестируем построение полной древовидной структуры
    console.log('\n4. Строим полную древовидную структуру...');
    const tree = await api.buildCollectionTree();

    console.log('\n📋 Полная структура:');
    api.printCollectionTree(tree);

    console.log('\n✅ Тестирование завершено успешно!');
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  }
}

// Запускаем тест только если файл выполняется напрямую
if (typeof window === 'undefined') {
  testRaindropAPI();
}
