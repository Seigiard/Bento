# TODO.md - Миграция на Preact

⚠️ **Важно:** Проект в данный момент использует vanilla TypeScript без фреймворков. Миграция на Preact потребует полной переработки архитектуры.

## 🎯 Этап 1: Миграция на Preact

### 📦 Установка и настройка Preact

- [ ] **Установить Preact и зависимости** ⚠️ НЕ УСТАНОВЛЕН
  - Установить `preact`, `@preact/signals`
  - Настроить Parcel для работы с Preact (.parcelrc)
  - Добавить TypeScript типы для Preact
  - Обновить tsconfig.json с Preact JSX настройками

- [ ] **Настройка build системы**
  - Обновить package.json scripts
  - Настроить hot reload для Preact компонентов
  - Проверить совместимость с существующими dev tools

### 🔧 Архитектурные изменения

- [ ] **Интеграция NanoStore с Preact Signals**
  - Создать хуки для работы с nanostores в Preact
  - Сохранить существующий $settings store с API ключом
  - Обеспечить реактивность между nanostores и Preact

- [ ] **CachedRaindropAPI интеграция**
  - ✅ Существующий CachedRaindropAPI работает с IndexedDB
  - Создать сервис инициализации API с NanoStore
  - ✅ Кэширование root категорий уже реализовано

### 🏗️ Компоненты

- [ ] **Root компонент (App.tsx)**
  - Создать главный App компонент
  - Инициализация CachedRaindropAPI через $settings.raindropApiKey
  - Загрузка root категорий при монтировании
  - Обработка состояний loading/error/success

- [ ] **CategoryBlock компонент**
  - Компонент для отображения одной root категории в виде блока
  - Props: category data, onClick handler
  - Стилизация под существующий дизайн

- [ ] **CategoryGrid компонент**
  - Контейнер для списка CategoryBlock компонентов
  - Responsive grid layout
  - Обработка пустого состояния

### 🔄 Миграция данных

- [ ] **Использование существующих сервисов**
  - Подключить `src/services/raindrop/cached-raindrop-api.ts`
  - Использовать существующие типы из `raindrop-schemas.ts`
  - Сохранить логику работы с IndexedDB

- [ ] **Настройка API инициализации**
  - Создать hook useRaindropAPI для инициализации через NanoStore
  - Обеспечить реактивность при изменении API ключа
  - Обработка ошибок авторизации

### 🎨 Интерфейс

- [ ] **Адаптация существующих стилей**
  - Перенести CSS классы для категорий
  - Адаптировать под блочное отображение
  - Сохранить responsive поведение

- [ ] **Состояния загрузки**
  - Loading skeleton для категорий
  - Error состояния с retry функционалом
  - Empty state когда категорий нет

### 🧪 Тестирование

- [ ] **Тестирование компонентов**
  - Unit тесты для основных компонентов
  - Тестирование интеграции с CachedRaindropAPI
  - Тестирование работы с NanoStore

- [ ] **Интеграционное тестирование**
  - E2E тест загрузки категорий
  - Тест работы кэширования
  - Тест реактивности при смене API ключа

## 🎯 Этап 2: Collapsible категории с DaisyUI

### 🎨 UI Компоненты

- [ ] **Интеграция DaisyUI Collapsible**
  - ✅ DaisyUI установлен в devDependencies
  - ⚠️ Требует Preact для компонентного подхода
  - Создать CollapsibleCategory компонент на базе DaisyUI
  - Настроить стили для категорий и ссылок
  - Добавить анимации expand/collapse

- [ ] **CategoryItem компонент**
  - Заголовок категории с иконкой expand/collapse
  - Интеграция с DaisyUI collapse component
  - Обработка клика для переключения состояния
  - Индикатор загрузки при fetching данных

- [ ] **LinksList компонент**
  - Отображение ссылок в виде списка
  - Link item с favicon, title, description
  - Стилизация под дизайн системы
  - Обработка длинных списков (виртуализация если нужно)

- [ ] **ChildCategoriesList компонент**
  - Отображение child-категорий в свернутом виде
  - Рекурсивная структура для вложенности
  - Единообразный стиль с родительскими категориями

### 💾 Управление состоянием

- [x] **Расширение IndexedDB схемы** ✅ УЖЕ РЕАЛИЗОВАНО
  - ✅ Таблица `collectionStates` для хранения expand/collapse состояний
  - ✅ Методы `getCollectionState()` и `setCollectionState()` в `raindrop-db.ts`
  - ✅ Интерфейс `CollectionState` с полями collectionId, isExpanded, updatedAt

- [ ] **CategoryState store/service**
  - Сервис для управления состояниями категорий
  - ✅ Методы getCategoryState, setCategoryState уже есть в `raindrop-db.ts`
  - ✅ Интеграция с IndexedDB реализована
  - Требуется добавить toggleCategory метод
  - Реактивное обновление UI при изменении состояний (требует Preact)

- [x] **Расширение CachedRaindropAPI** ✅ УЖЕ РЕАЛИЗОВАНО
  - ✅ Метод `getChildCollections()` с кэшированием
  - ✅ Метод `getRaindrops(collectionId)` с кэшированием
  - Оптимизация: загружать только при первом expand (требует интеграции с UI)
  - ✅ TTL настройки работают для всех методов

### 🔄 Логика загрузки данных

- [ ] **Lazy Loading стратегия**
  - Загружать child-категории только при expand
  - Загружать ссылки только при expand
  - Кэшировать загруженные данные в IndexedDB
  - Показывать loading состояние во время загрузки

- [ ] **Состояния категории**
  - COLLAPSED - свернута, данные не загружены
  - LOADING - разворачивается, идет загрузка
  - EXPANDED - развернута, данные загружены
  - ERROR - ошибка при загрузке данных

- [ ] **Обновление CategoryBlock компонента**
  - Добавить поддержку expand/collapse логики
  - Интеграция с CategoryState service
  - Обработка состояний loading/error
  - Рендер ChildCategoriesList и LinksList при expand

### 🏗️ Архитектурные улучшения

- [ ] **Hooks для состояния категорий**
  - useCategoryState(categoryId) - получение/изменение состояния
  - useCategoryData(categoryId) - загрузка child данных
  - useExpandedCategories() - список всех развернутых категорий
  - Оптимизация re-renders с помощью мемоизации

- [ ] **Сервис CategoryManager**
  - Централизованное управление expand/collapse логикой
  - Методы: expandCategory, collapseCategory, toggleCategory
  - Интеграция с CachedRaindropAPI и CategoryState
  - Обработка ошибок и retry логика

- [ ] **Типизация для вложенной структуры**
  - Типы для CategoryWithChildren
  - Типы для CategoryState (expanded, loading, error)
  - Типы для nested structure рендеринга
  - Валидация данных с valibot

### 🎛️ UX улучшения

- [ ] **Keyboard navigation**
  - Arrow keys для навигации между категориями
  - Enter/Space для expand/collapse
  - Escape для collapse всех
  - Tab order для accessibility

- [ ] **Анимации и визуальные индикаторы**
  - Smooth expand/collapse анимации
  - Loading spinners для категорий
  - Визуальная иерархия для child категорий
  - Hover states и focus indicators

- [ ] **Контекстное меню (опционально)**
  - Expand All / Collapse All для категории
  - Refresh category data
  - Open all links in tabs
  - Export category links
