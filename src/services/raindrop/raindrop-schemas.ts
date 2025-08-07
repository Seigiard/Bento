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

const ParentSchema = v.object({
  $id: v.number(),
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

const RaindropItemSchemaResponse = v.object({
  items: v.array(RaindropItemSchema),
})

// Базовая схема для упрощенной коллекции (без children)
const RaindropCollectionBaseSchema = v.object({
  _id: v.number(),
  title: v.string(),
  parent: v.optional(v.nullable(ParentSchema)),
  sort: v.optional(v.number()),
  created: v.optional(v.string()),
})

const RaindropCollectionSchemaResponse = v.object({
  items: v.array(RaindropCollectionBaseSchema),
})

// Полная схема с children (используется только для валидации)
export const RaindropCollectionSchema = v.object({
  ...RaindropCollectionBaseSchema.entries,
  parent: v.optional(ParentSchema), // переопределяем parent без nullable
  children: v.optional(v.array(v.any())), // Используем any для children чтобы избежать циклической ссылки
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

const UserSchemaResponse = v.object({
  user: UserSchema,
})

// Типы, выведенные из схем
export type RaindropItemFull = v.InferOutput<typeof RaindropItemFullSchema>
export type RaindropItem = v.InferOutput<typeof RaindropItemSchema>
export type RaindropCollection = Omit<v.InferOutput<typeof RaindropCollectionSchema>, 'children'> & {
  children?: RaindropCollection[]
}
export type User = v.InferOutput<typeof UserSchema>

// Функция для преобразования полной коллекции в упрощенную
export function safeParseCollectionResponse(
  data: unknown,
): RaindropCollection[] {
  // Валидируем базовые поля (без children чтобы избежать циклических ссылок)
  const result = v.safeParse(RaindropCollectionSchemaResponse, data)

  if (!result.success) {
    console.error('Collection validation failed:', {
      issues: result.issues,
      data: data
    })
    throw new Error(`Invalid collection format: ${result.issues.map(i => i.message).join(', ')}`)
  }

  // Возвращаем валидированные данные с правильной обработкой parent
  return result.output.items.map(collection => ({
    ...collection,
    parent: collection?.parent || undefined, // Преобразуем null в undefined
  })) as RaindropCollection[]
}

// Функция для преобразования полного raindrop в упрощенный
export function safeParseRaindropResponse(
  data: unknown,
): RaindropItem[] {
  // Валидируем через схему
  const result = v.safeParse(RaindropItemSchemaResponse, data)

  if (!result.success) {
    console.error('Raindrop validation failed:', {
      issues: result.issues,
      data: data
    })
    throw new Error(`Invalid raindrop format: ${result.issues.map(i => i.message).join(', ')}`)
  }

  return result.output.items
}

export function safeParseUserResponse(
  data: unknown,
): User {
  // Валидируем через схему
  const result = v.safeParse(UserSchemaResponse, data)

  if (!result.success) {
    console.error('User validation failed:', {
      issues: result.issues,
      data
    })
    throw new Error(`Invalid raindrop format: ${result.issues.map(i => i.message).join(', ')}`)
  }

  return result.output.user
}
