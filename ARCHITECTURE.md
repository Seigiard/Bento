# Архитектура Raindrop Extension

## Обзор

Данный документ описывает архитектурный подход для разработки расширения Raindrop.io с акцентом на максимальную изоляцию слоев и возможность миграции между различными UI фреймворками (React, Vue, vanilla JS).

## Основные принципы

### 1. **Изоляция бизнес-логики от UI**
Core слой не содержит никаких зависимостей от UI фреймворков, DOM API или специфичных для платформы функций.

### 2. **Dependency Injection через конструкторы**
Все зависимости передаются явно через конструкторы, без использования глобальных состояний или сложных DI контейнеров.

### 3. **Event-driven коммуникация**
Сервисы уведомляют об изменениях через простую систему подписок, что позволяет UI слою реагировать на изменения framework-agnostic способом.

### 4. **Адаптеры для внешних систем**
Все взаимодействия с внешними API, базами данных и другими системами изолированы в отдельном слое адаптеров.

## Структура слоев

```
src/
├── core/                    # Бизнес-логика (не зависит ни от чего)
│   ├── models/             # Модели данных
│   ├── services/           # Бизнес-сервисы
│   └── types/              # TypeScript типы и интерфейсы
│
├── data/                    # Адаптеры для внешних систем
│   ├── providers/          # Реализации data/state провайдеров
│   ├── api/               # HTTP клиенты
│   └── storage/           # Работа с локальным хранилищем
│
├── ui-adapters/            # Мосты между Core и UI фреймворками
│   ├── react/             # React hooks
│   ├── vue/               # Vue composables
│   └── vanilla/           # Vanilla JS адаптеры
│
├── ui/                     # UI реализации
│   └── [framework]/       # Компоненты конкретного фреймворка
│
└── init/                   # Инициализация и композиция
    └── createApp.js       # Composition root
```

## Core Layer

### Модели

```javascript
// core/models/Category.js
export class Category {
  constructor(id, title, parentId = null) {
    this.id = id
    this.title = title
    this.parentId = parentId
    this.isExpanded = false
    this.children = []
    this.raindrops = []
  }
}

// core/models/Raindrop.js
export class Raindrop {
  constructor(id, title, link, excerpt, tags = []) {
    this.id = id
    this.title = title
    this.link = link
    this.excerpt = excerpt
    this.tags = tags
  }
}
```

### Интерфейсы

```javascript
// core/types/providers.js
export interface IDataProvider {
  getRootCategories(): Promise<Category[]>
  getChildCategories(parentId: string): Promise<Category[]>
  getCategoryRaindrops(categoryId: string): Promise<Raindrop[]>
}

export interface IStateProvider {
  getState(key: string): Promise<any>
  setState(key: string, value: any): Promise<void>
}
```

### Сервисы

```javascript
// core/services/CategoryService.js
export class CategoryService {
  constructor(dataProvider, stateProvider) {
    this.dataProvider = dataProvider
    this.stateProvider = stateProvider
    this.listeners = new Set()
  }

  // Методы бизнес-логики
  async loadRootCategories() {
    const categories = await this.dataProvider.getRootCategories()
    this.notifyListeners({ type: 'categoriesLoaded', categories })
    return categories
  }

  async toggleCategory(categoryId) {
    const state = await this.stateProvider.getState(`category:${categoryId}`)

    if (!state?.isExpanded) {
      const children = await this.dataProvider.getChildCategories(categoryId)
      await this.stateProvider.setState(`category:${categoryId}`, { isExpanded: true })

      this.notifyListeners({
        type: 'categoryExpanded',
        categoryId,
        children
      })
    } else {
      await this.stateProvider.setState(`category:${categoryId}`, { isExpanded: false })
      this.notifyListeners({ type: 'categoryCollapsed', categoryId })
    }
  }

  // Система подписок
  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notifyListeners(event) {
    this.listeners.forEach(listener => listener(event))
  }
}
```

## Data Layer

### Data Providers

```javascript
// data/providers/RaindropDataProvider.js
export class RaindropDataProvider {
  constructor(apiClient, cache) {
    this.apiClient = apiClient
    this.cache = cache
  }

  async getRootCategories() {
    const cacheKey = 'categories:root'
    const cached = await this.cache.get(cacheKey)

    if (cached && !this.isExpired(cached)) {
      return cached.data
    }

    const response = await this.apiClient.getCollections()
    const categories = response.items.map(item =>
      new Category(item._id, item.title)
    )

    await this.cache.set(cacheKey, {
      data: categories,
      timestamp: Date.now()
    })

    return categories
  }

  async getChildCategories(parentId) {
    // Аналогичная логика с кешированием
  }

  isExpired(cached, ttl = 5 * 60 * 1000) {
    return Date.now() - cached.timestamp > ttl
  }
}
```

### State Providers

```javascript
// data/providers/IndexedDBStateProvider.js
export class IndexedDBStateProvider {
  constructor() {
    this.dbName = 'RaindropExtension'
    this.version = 1
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains('states')) {
          db.createObjectStore('states', { keyPath: 'key' })
        }
      }
    })
  }

  async getState(key) {
    const transaction = this.db.transaction(['states'], 'readonly')
    const store = transaction.objectStore('states')

    return new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = () => resolve(request.result?.value)
      request.onerror = () => reject(request.error)
    })
  }

  async setState(key, value) {
    const transaction = this.db.transaction(['states'], 'readwrite')
    const store = transaction.objectStore('states')

    return new Promise((resolve, reject) => {
      const request = store.put({ key, value })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}
```

## UI Adapters

### React Adapter

```javascript
// ui-adapters/react/useCategoryService.js
import { useState, useEffect, useCallback } from 'react'

export function useCategoryService(categoryService) {
  const [categories, setCategories] = useState([])
  const [expandedIds, setExpandedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = categoryService.subscribe((event) => {
      switch (event.type) {
        case 'categoriesLoaded':
          setCategories(event.categories)
          setLoading(false)
          break

        case 'categoryExpanded':
          setExpandedIds(prev => new Set([...prev, event.categoryId]))
          updateCategoryInTree(event.categoryId, cat => ({
            ...cat,
            children: event.children,
            isExpanded: true
          }))
          break

        case 'categoryCollapsed':
          setExpandedIds(prev => {
            const next = new Set(prev)
            next.delete(event.categoryId)
            return next
          })
          updateCategoryInTree(event.categoryId, cat => ({
            ...cat,
            isExpanded: false
          }))
          break

        case 'error':
          setError(event.error)
          setLoading(false)
          break
      }
    })

    // Начальная загрузка
    categoryService.loadRootCategories().catch(err => {
      setError(err)
      setLoading(false)
    })

    return unsubscribe
  }, [categoryService])

  const toggleCategory = useCallback((categoryId) => {
    categoryService.toggleCategory(categoryId)
  }, [categoryService])

  const updateCategoryInTree = useCallback((categoryId, updater) => {
    setCategories(prev => updateCategoryRecursive(prev, categoryId, updater))
  }, [])

  return {
    categories,
    expandedIds,
    loading,
    error,
    toggleCategory
  }
}

function updateCategoryRecursive(categories, targetId, updater) {
  return categories.map(category => {
    if (category.id === targetId) {
      return updater(category)
    }
    if (category.children?.length > 0) {
      return {
        ...category,
        children: updateCategoryRecursive(category.children, targetId, updater)
      }
    }
    return category
  })
}
```

### Vue Adapter

```javascript
// ui-adapters/vue/useCategoryService.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useCategoryService(categoryService) {
  const categories = ref([])
  const expandedIds = ref(new Set())
  const loading = ref(true)
  const error = ref(null)

  let unsubscribe = null

  const toggleCategory = (categoryId) => {
    categoryService.toggleCategory(categoryId)
  }

  onMounted(async () => {
    unsubscribe = categoryService.subscribe((event) => {
      // Обработка событий аналогично React версии
    })

    try {
      await categoryService.loadRootCategories()
    } catch (err) {
      error.value = err
      loading.value = false
    }
  })

  onUnmounted(() => {
    unsubscribe?.()
  })

  return {
    categories,
    expandedIds,
    loading,
    error,
    toggleCategory
  }
}
```

### Vanilla JS Adapter

```javascript
// ui-adapters/vanilla/CategoryController.js
export class CategoryController {
  constructor(categoryService, rootElement) {
    this.categoryService = categoryService
    this.rootElement = rootElement
    this.state = {
      categories: [],
      expandedIds: new Set(),
      loading: true,
      error: null
    }
    this.unsubscribe = null
  }

  init() {
    // Подписка на события
    this.unsubscribe = this.categoryService.subscribe((event) => {
      this.handleEvent(event)
      this.render()
    })

    // Обработка кликов
    this.rootElement.addEventListener('click', (e) => {
      const categoryEl = e.target.closest('[data-category-id]')
      if (categoryEl) {
        const categoryId = categoryEl.dataset.categoryId
        this.categoryService.toggleCategory(categoryId)
      }
    })

    // Начальная загрузка
    this.categoryService.loadRootCategories().catch(err => {
      this.state.error = err
      this.state.loading = false
      this.render()
    })
  }

  handleEvent(event) {
    switch (event.type) {
      case 'categoriesLoaded':
        this.state.categories = event.categories
        this.state.loading = false
        break
      // Остальные события...
    }
  }

  render() {
    if (this.state.loading) {
      this.rootElement.innerHTML = '<div class="loading">Loading...</div>'
      return
    }

    if (this.state.error) {
      this.rootElement.innerHTML = `<div class="error">${this.state.error.message}</div>`
      return
    }

    this.rootElement.innerHTML = this.renderCategories(this.state.categories)
  }

  renderCategories(categories, level = 0) {
    return `
      <ul class="categories" style="margin-left: ${level * 20}px">
        ${categories.map(cat => `
          <li>
            <div class="category" data-category-id="${cat.id}">
              <span class="toggle">${cat.isExpanded ? '▼' : '▶'}</span>
              <span class="title">${cat.title}</span>
            </div>
            ${cat.isExpanded && cat.children ? this.renderCategories(cat.children, level + 1) : ''}
          </li>
        `).join('')}
      </ul>
    `
  }

  destroy() {
    this.unsubscribe?.()
  }
}
```

## Инициализация

### Composition Root

```javascript
// init/createApp.js
import { RaindropAPIClient } from '../data/api/RaindropAPIClient'
import { RaindropDataProvider } from '../data/providers/RaindropDataProvider'
import { IndexedDBStateProvider } from '../data/providers/IndexedDBStateProvider'
import { MemoryCache } from '../data/cache/MemoryCache'
import { CategoryService } from '../core/services/CategoryService'
import { RaindropService } from '../core/services/RaindropService'

export async function createApp(config) {
  // Создание инфраструктурных компонентов
  const apiClient = new RaindropAPIClient(config.apiKey)
  const cache = new MemoryCache()
  const stateProvider = new IndexedDBStateProvider()

  // Инициализация
  await stateProvider.init()

  // Создание провайдеров
  const dataProvider = new RaindropDataProvider(apiClient, cache)

  // Создание сервисов
  const categoryService = new CategoryService(dataProvider, stateProvider)
  const raindropService = new RaindropService(dataProvider, stateProvider)

  return {
    services: {
      categoryService,
      raindropService
    },
    // Методы для управления жизненным циклом
    destroy() {
      // Очистка ресурсов
      cache.clear()
    }
  }
}
```
## Примеры использования

### React приложение

```javascript
// ui/react/App.jsx
import React, { useMemo } from 'react'
import { createApp } from '../../init/createApp'
import { useCategoryService } from '../../ui-adapters/react/useCategoryService'
import { CategoryTree } from './components/CategoryTree'

function App() {
  // Создаем приложение один раз
  const app = useMemo(() => {
    return createApp({
      apiKey: process.env.REACT_APP_RAINDROP_API_KEY
    })
  }, [])

  // Используем адаптер для подключения к сервису
  const {
    categories,
    expandedIds,
    loading,
    error,
    toggleCategory
  } = useCategoryService(app.services.categoryService)

  if (loading) return <div>Loading categories...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="app">
      <h1>My Raindrop Collections</h1>
      <CategoryTree
        categories={categories}
        expandedIds={expandedIds}
        onToggle={toggleCategory}
      />
    </div>
  )
}

// ui/react/components/CategoryTree.jsx
export function CategoryTree({ categories, expandedIds, onToggle }) {
  return (
    <ul className="category-tree">
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          category={category}
          isExpanded={expandedIds.has(category.id)}
          onToggle={onToggle}
        />
      ))}
    </ul>
  )
}

function CategoryItem({ category, isExpanded, onToggle }) {
  return (
    <li>
      <div
        className="category-header"
        onClick={() => onToggle(category.id)}
      >
        <span className="toggle-icon">
          {isExpanded ? '▼' : '▶'}
        </span>
        <span className="category-title">{category.title}</span>
        <span className="count">{category.count || 0}</span>
      </div>

      {isExpanded && category.children && (
        <ul className="category-children">
          {category.children.map(child => (
            <CategoryItem
              key={child.id}
              category={child}
              isExpanded={isExpanded}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}

      {isExpanded && category.raindrops && (
        <RaindropList raindrops={category.raindrops} />
      )}
    </li>
  )
}
```

### Vue приложение

```javascript
// ui/vue/App.vue
<template>
  <div class="app">
    <h1>My Raindrop Collections</h1>

    <div v-if="loading">Loading categories...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>

    <CategoryTree
      v-else
      :categories="categories"
      :expanded-ids="expandedIds"
      @toggle="toggleCategory"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { createApp } from '../../init/createApp'
import { useCategoryService } from '../../ui-adapters/vue/useCategoryService'
import CategoryTree from './components/CategoryTree.vue'

// Создаем приложение
const app = await createApp({
  apiKey: import.meta.env.VITE_RAINDROP_API_KEY
})

// Используем composable
const {
  categories,
  expandedIds,
  loading,
  error,
  toggleCategory
} = useCategoryService(app.services.categoryService)
</script>

// ui/vue/components/CategoryTree.vue
<template>
  <ul class="category-tree">
    <CategoryItem
      v-for="category in categories"
      :key="category.id"
      :category="category"
      :is-expanded="expandedIds.has(category.id)"
      @toggle="$emit('toggle', $event)"
    />
  </ul>
</template>

<script setup>
import CategoryItem from './CategoryItem.vue'

defineProps({
  categories: Array,
  expandedIds: Set
})

defineEmits(['toggle'])
</script>

// ui/vue/components/CategoryItem.vue
<template>
  <li>
    <div
      class="category-header"
      @click="$emit('toggle', category.id)"
    >
      <span class="toggle-icon">
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      <span class="category-title">{{ category.title }}</span>
      <span class="count">{{ category.count || 0 }}</span>
    </div>

    <ul v-if="isExpanded && category.children" class="category-children">
      <CategoryItem
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        :is-expanded="isExpanded"
        @toggle="$emit('toggle', $event)"
      />
    </ul>

    <RaindropList
      v-if="isExpanded && category.raindrops"
      :raindrops="category.raindrops"
    />
  </li>
</template>

<script setup>
import RaindropList from './RaindropList.vue'

defineProps({
  category: Object,
  isExpanded: Boolean
})

defineEmits(['toggle'])
</script>
```

### Vanilla JavaScript приложение

```javascript
// ui/vanilla/index.html
<!DOCTYPE html>
<html>
<head>
  <title>Raindrop Collections</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="app.js"></script>
</body>
</html>

// ui/vanilla/app.js
import { createApp } from '../../init/createApp.js'
import { CategoryController } from '../../ui-adapters/vanilla/CategoryController.js'

async function initApp() {
  try {
    // Создаем приложение
    const app = await createApp({
      apiKey: 'your-api-key-here'
    })

    // Создаем контроллер для управления UI
    const rootElement = document.getElementById('app')
    const controller = new CategoryController(
      app.services.categoryService,
      rootElement
    )

    // Инициализируем
    controller.init()

    // Cleanup при закрытии
    window.addEventListener('beforeunload', () => {
      controller.destroy()
      app.destroy()
    })

  } catch (error) {
    console.error('Failed to initialize app:', error)
    document.getElementById('app').innerHTML = `
      <div class="error">
        Failed to load application: ${error.message}
      </div>
    `
  }
}

// Запускаем приложение
initApp()

// ui/vanilla/styles.css
.category-tree {
  list-style: none;
  padding: 0;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  user-select: none;
}

.category-header:hover {
  background-color: #f0f0f0;
}

.toggle-icon {
  margin-right: 8px;
  font-size: 12px;
}

.category-title {
  flex: 1;
}

.count {
  color: #666;
  font-size: 14px;
}

.category-children {
  margin-left: 20px;
}

.loading, .error {
  padding: 20px;
  text-align: center;
}

.error {
  color: #d32f2f;
}
```

### Использование в браузерном расширении

```javascript
// extension/popup/popup.js
import { createApp } from '../../init/createApp.js'
import { CategoryController } from '../../ui-adapters/vanilla/CategoryController.js'

// Получаем API ключ из storage
chrome.storage.sync.get(['apiKey'], async (result) => {
  if (!result.apiKey) {
    document.body.innerHTML = `
      <div class="setup-required">
        <p>Please set up your Raindrop API key in extension options</p>
        <button id="open-options">Open Options</button>
      </div>
    `

    document.getElementById('open-options').addEventListener('click', () => {
      chrome.runtime.openOptionsPage()
    })
    return
  }

  // Инициализируем приложение
  const app = await createApp({ apiKey: result.apiKey })

  const controller = new CategoryController(
    app.services.categoryService,
    document.getElementById('categories')
  )

  controller.init()
})

// extension/content-script.js
import { createApp } from '../../init/createApp.js'

// Создаем виджет для отображения на странице
class RaindropWidget {
  constructor(app) {
    this.app = app
    this.widget = null
  }

  async init() {
    // Создаем контейнер для виджета
    this.widget = document.createElement('div')
    this.widget.id = 'raindrop-widget'
    this.widget.className = 'raindrop-widget-container'
    document.body.appendChild(this.widget)

    // Используем контроллер для управления
    const controller = new CategoryController(
      this.app.services.categoryService,
      this.widget
    )

    controller.init()

    // Добавляем кнопку закрытия
    const closeBtn = document.createElement('button')
    closeBtn.textContent = '×'
    closeBtn.className = 'close-widget'
    closeBtn.onclick = () => this.destroy()
    this.widget.appendChild(closeBtn)
  }

  destroy() {
    this.widget?.remove()
  }
}

// Инициализация при загрузке страницы
chrome.storage.sync.get(['apiKey'], async (result) => {
  if (result.apiKey) {
    const app = await createApp({ apiKey: result.apiKey })
    const widget = new RaindropWidget(app)

    // Показываем виджет по хоткею
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        widget.init()
      }
    })
  }
})
```

### Тестирование

```javascript
// tests/core/services/CategoryService.test.js
import { CategoryService } from '../../../core/services/CategoryService'
import { Category } from '../../../core/models/Category'

describe('CategoryService', () => {
  let service
  let mockDataProvider
  let mockStateProvider

  beforeEach(() => {
    mockDataProvider = {
      getRootCategories: jest.fn(),
      getChildCategories: jest.fn()
    }

    mockStateProvider = {
      getState: jest.fn(),
      setState: jest.fn()
    }

    service = new CategoryService(mockDataProvider, mockStateProvider)
  })

  test('loadRootCategories loads and notifies listeners', async () => {
    const mockCategories = [
      new Category('1', 'Work'),
      new Category('2', 'Personal')
    ]

    mockDataProvider.getRootCategories.mockResolvedValue(mockCategories)

    const listener = jest.fn()
    service.subscribe(listener)

    const result = await service.loadRootCategories()

    expect(result).toEqual(mockCategories)
    expect(listener).toHaveBeenCalledWith({
      type: 'categoriesLoaded',
      categories: mockCategories
    })
  })

  test('toggleCategory expands collapsed category', async () => {
    const categoryId = '123'
    const mockChildren = [
      new Category('456', 'Child 1', categoryId),
      new Category('789', 'Child 2', categoryId)
    ]

    mockStateProvider.getState.mockResolvedValue({ isExpanded: false })
    mockDataProvider.getChildCategories.mockResolvedValue(mockChildren)

    const listener = jest.fn()
    service.subscribe(listener)

    await service.toggleCategory(categoryId)

    expect(mockStateProvider.setState).toHaveBeenCalledWith(
      `category:${categoryId}`,
      { isExpanded: true }
    )

    expect(listener).toHaveBeenCalledWith({
      type: 'categoryExpanded',
      categoryId,
      children: mockChildren
    })
  })
})

// tests/ui-adapters/react/useCategoryService.test.js
import { renderHook, act } from '@testing-library/react-hooks'
import { useCategoryService } from '../../../ui-adapters/react/useCategoryService'
import { CategoryService } from '../../../core/services/CategoryService'

describe('useCategoryService', () => {
  test('updates state when categories are loaded', async () => {
    const mockService = new CategoryService(
      { getRootCategories: jest.fn().mockResolvedValue([]) },
      { getState: jest.fn(), setState: jest.fn() }
    )

    const { result, waitForNextUpdate } = renderHook(() =>
      useCategoryService(mockService)
    )

    expect(result.current.loading).toBe(true)

    await waitForNextUpdate()

    expect(result.current.loading).toBe(false)
    expect(result.current.categories).toEqual([])
  })
})
```

### Миграция между фреймворками

```javascript
// Пример миграции компонента с React на Vue

// 1. Core и Data слои остаются без изменений

// 2. Создаем новый UI adapter для Vue (если еще нет)
// ui-adapters/vue/useCategoryService.js

// 3. Переписываем только UI компоненты
// Было (React):
function CategoryItem({ category, onToggle }) {
  return <div onClick={() => onToggle(category.id)}>{category.title}</div>
}

// Стало (Vue):
<template>
  <div @click="$emit('toggle', category.id)">{{ category.title }}</div>
</template>

// 4. Инициализация остается похожей
const app = await createApp({ apiKey: 'xxx' })
// Используем тот же app объект с Vue адаптером
```

## Преимущества подхода

1. **Независимость от UI фреймворка** - бизнес-логика полностью изолирована
2. **Простота тестирования** - каждый слой тестируется отдельно
3. **Переиспользование кода** - один и тот же core работает везде
4. **Постепенная миграция** - можно мигрировать по частям
5. **Минимальный boilerplate** - нет избыточных абстракций
