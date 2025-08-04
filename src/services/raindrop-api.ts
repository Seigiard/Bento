export interface RaindropCollection {
  _id: number;
  title: string;
  color?: string;
  count?: number;
  cover?: string[];
  parent?: {
    $id: number;
  };
  children?: RaindropCollection[];
  raindrops?: RaindropItem[];
}

export interface RaindropItem {
  _id: number;
  title: string;
  link: string;
  excerpt?: string;
  cover?: string;
  domain?: string;
  created?: string;
  lastUpdate?: string;
}

export interface RaindropApiResponse<T> {
  result: boolean;
  items: T[];
  count?: number;
}

export class RaindropAPI {
  private apiKey: string;
  private baseUrl = 'https://api.raindrop.io/rest/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string): Promise<RaindropApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Raindrop API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Получить корневые коллекции
   */
  async getRootCollections(): Promise<RaindropCollection[]> {
    try {
      const response = await this.makeRequest<RaindropCollection>('/collections');
      return response.items || [];
    } catch (error) {
      console.error('Error fetching root collections:', error);
      return [];
    }
  }

  /**
   * Получить дочерние коллекции
   */
  async getChildCollections(): Promise<RaindropCollection[]> {
    try {
      const response = await this.makeRequest<RaindropCollection>('/collections/childrens');
      return response.items || [];
    } catch (error) {
      console.error('Error fetching child collections:', error);
      return [];
    }
  }

  /**
   * Получить raindrops для указанной коллекции
   */
  async getRaindrops(collectionId: number, perpage = 50): Promise<RaindropItem[]> {
    try {
      const response = await this.makeRequest<RaindropItem>(`/raindrops/${collectionId}?perpage=${perpage}`);
      return response.items || [];
    } catch (error) {
      console.error(`Error fetching raindrops for collection ${collectionId}:`, error);
      return [];
    }
  }

  /**
   * Построить древовидную структуру коллекций с их raindrops
   */
  async buildCollectionTree(): Promise<RaindropCollection[]> {
    try {
      // Получаем все коллекции
      const [rootCollections, childCollections] = await Promise.all([
        this.getRootCollections(),
        this.getChildCollections(),
      ]);

      // Создаем карту для быстрого поиска коллекций
      const allCollections = [...rootCollections, ...childCollections];
      const collectionMap = new Map<number, RaindropCollection>();
      
      allCollections.forEach(collection => {
        collectionMap.set(collection._id, { ...collection, children: [], raindrops: [] });
      });

      // Строим древовидную структуру
      const rootTree: RaindropCollection[] = [];

      // Добавляем дочерние коллекции к родительским
      childCollections.forEach(child => {
        if (child.parent?.$id) {
          const parent = collectionMap.get(child.parent.$id);
          const childWithChildren = collectionMap.get(child._id);
          if (parent && childWithChildren) {
            parent.children!.push(childWithChildren);
          }
        }
      });

      // Добавляем корневые коллекции в результат
      rootCollections.forEach(root => {
        const rootWithChildren = collectionMap.get(root._id);
        if (rootWithChildren) {
          rootTree.push(rootWithChildren);
        }
      });

      // Получаем raindrops для всех коллекций
      await this.loadRaindropsForTree(rootTree);

      return rootTree;
    } catch (error) {
      console.error('Error building collection tree:', error);
      return [];
    }
  }

  /**
   * Рекурсивно загружает raindrops для всех коллекций в дереве
   */
  private async loadRaindropsForTree(collections: RaindropCollection[]): Promise<void> {
    const promises = collections.map(async (collection) => {
      // Загружаем raindrops для текущей коллекции
      collection.raindrops = await this.getRaindrops(collection._id);
      
      // Рекурсивно обрабатываем дочерние коллекции
      if (collection.children && collection.children.length > 0) {
        await this.loadRaindropsForTree(collection.children);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Выводит древовидную структуру в консоль для отладки
   */
  printCollectionTree(collections: RaindropCollection[], indent = 0): void {
    collections.forEach(collection => {
      const indentStr = '  '.repeat(indent);
      console.log(`${indentStr}📁 ${collection.title} (${collection.count || 0} items, ${collection.raindrops?.length || 0} raindrops loaded)`);
      
      // Выводим raindrops
      if (collection.raindrops && collection.raindrops.length > 0) {
        collection.raindrops.slice(0, 3).forEach(raindrop => {
          console.log(`${indentStr}  🔗 ${raindrop.title}`);
        });
        if (collection.raindrops.length > 3) {
          console.log(`${indentStr}  ... и ещё ${collection.raindrops.length - 3} raindrops`);
        }
      }

      // Рекурсивно выводим дочерние коллекции
      if (collection.children && collection.children.length > 0) {
        this.printCollectionTree(collection.children, indent + 1);
      }
    });
  }

  /**
   * Основной метод для получения и вывода всей структуры
   */
  async fetchAndPrintFullStructure(): Promise<RaindropCollection[]> {
    console.log('🔄 Загружаем структуру коллекций Raindrop.io...');
    
    const tree = await this.buildCollectionTree();
    
    console.log('\n📋 Структура коллекций:');
    this.printCollectionTree(tree);
    
    console.log(`\n✅ Загружено ${tree.length} корневых коллекций`);
    return tree;
  }
}