import * as v from 'valibot'

// Базовые схемы
const UserRefSchema = v.object({
  $ref: v.string(),
  $id: v.number(),
})

const CreatorRefSchema = v.object({
  _id: v.number(),
  name: v.string(),
  email: v.string(),
})

const AccessSchema = v.object({
  for: v.number(),
  level: v.number(),
  root: v.boolean(),
  draggable: v.boolean(),
})

const ParentSchema = v.object({
  $id: v.number(),
})

// Схема для коллекции (полная версия с сервера)
export const RaindropCollectionFullSchema = v.object({
  _id: v.number(),
  title: v.string(),
  description: v.optional(v.string()),
  user: UserRefSchema,
  public: v.boolean(),
  view: v.string(),
  count: v.number(),
  cover: v.array(v.string()),
  expanded: v.boolean(),
  creatorRef: v.optional(CreatorRefSchema),
  lastAction: v.string(),
  created: v.string(),
  lastUpdate: v.string(),
  parent: v.optional(v.nullable(ParentSchema)),
  sort: v.number(),
  slug: v.string(),
  access: AccessSchema,
  author: v.boolean(),
  color: v.optional(v.string()),
})

// Схема для медиа элемента
const MediaSchema = v.object({
  link: v.string(),
  type: v.string(),
  screenshot: v.optional(v.boolean()),
})

// Схема для напоминания
const ReminderSchema = v.object({
  date: v.nullable(v.string()),
})

// Схема для коллекции в raindrop
const CollectionRefSchema = v.object({
  $ref: v.string(),
  $id: v.number(),
  oid: v.optional(v.number()),
})

// Полная схема для raindrop элемента (с сервера)
export const RaindropItemFullSchema = v.object({
  _id: v.number(),
  link: v.string(),
  title: v.string(),
  excerpt: v.string(),
  note: v.string(),
  type: v.string(),
  user: UserRefSchema,
  cover: v.string(),
  media: v.array(MediaSchema),
  tags: v.array(v.string()),
  important: v.optional(v.boolean()),
  reminder: v.optional(ReminderSchema),
  removed: v.boolean(),
  created: v.string(),
  collection: CollectionRefSchema,
  highlights: v.array(v.unknown()),
  lastUpdate: v.string(),
  domain: v.string(),
  creatorRef: v.optional(CreatorRefSchema),
  sort: v.number(),
  collectionId: v.number(),
})

// Упрощенная схема для raindrop элемента (для UI)
export const RaindropItemSchema = v.object({
  _id: v.number(),
  title: v.string(),
  link: v.string(),
  domain: v.optional(v.string()),
  sort: v.number(),
})

// Схема для упрощенной коллекции (для UI)
export const RaindropCollectionSchema = v.object({
  _id: v.number(),
  title: v.string(),
  parent: v.optional(ParentSchema),
  children: v.optional(v.array(v.lazy(() => RaindropCollectionSchema))),
  sort: v.optional(v.number()),
  created: v.optional(v.string()),
})

// Схема для ответа API коллекций
export const CollectionsApiResponseSchema = v.object({
  result: v.boolean(),
  items: v.array(RaindropCollectionFullSchema),
  count: v.optional(v.number()),
})

// Схема для ответа API raindrops
export const RaindropsApiResponseSchema = v.object({
  result: v.boolean(),
  items: v.array(RaindropItemFullSchema),
  count: v.optional(v.number()),
  collectionId: v.optional(v.number()),
})

// Схема для группы коллекций в пользовательских данных
export const UserGroupSchema = v.object({
  title: v.string(),
  hidden: v.boolean(),
  sort: v.number(),
  collections: v.array(v.number()), // массив ID коллекций в порядке сортировки
})

// Схема для пользователя
export const UserSchema = v.object({
  _id: v.number(),
  groups: v.array(UserGroupSchema),
})

// Схема для ответа API пользователя
export const UserApiResponseSchema = v.object({
  result: v.boolean(),
  user: UserSchema,
})

// Типы, выведенные из схем
export type RaindropCollectionFull = v.InferOutput<typeof RaindropCollectionFullSchema>
export type RaindropCollection = v.InferOutput<typeof RaindropCollectionSchema>
export type RaindropItemFull = v.InferOutput<typeof RaindropItemFullSchema>
export type RaindropItem = v.InferOutput<typeof RaindropItemSchema>
export type CollectionsApiResponse = v.InferOutput<typeof CollectionsApiResponseSchema>
export type RaindropsApiResponse = v.InferOutput<typeof RaindropsApiResponseSchema>
export type UserGroup = v.InferOutput<typeof UserGroupSchema>
export type User = v.InferOutput<typeof UserSchema>
export type UserApiResponse = v.InferOutput<typeof UserApiResponseSchema>

// Функция для преобразования полной коллекции в упрощенную
export function transformCollectionToSimple(
  fullCollection: RaindropCollectionFull,
): RaindropCollection {
  return v.safeParse(RaindropCollectionSchema, fullCollection).output
}

// Функция для преобразования полного raindrop в упрощенный
export function transformRaindropToSimple(
  fullRaindrop: RaindropItemFull,
): RaindropItem {
  return v.safeParse(RaindropItemSchema, fullRaindrop).output
}
