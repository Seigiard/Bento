import * as v from "valibot";

const ParentSchema = v.object({
  $id: v.number(),
});

// Упрощенная схема для raindrop элемента (для UI)
const RaindropItemSchema = v.object({
  _id: v.number(),
  title: v.string(),
  link: v.string(),
  domain: v.optional(v.string()),
  sort: v.number(),
});

const RaindropItemSchemaResponse = v.object({
  items: v.array(RaindropItemSchema),
});

// Базовая схема для упрощенной коллекции (без children)
const CollectionBaseSchema = v.object({
  _id: v.number(),
  title: v.string(),
  parent: v.optional(v.nullable(ParentSchema)),
  sort: v.optional(v.number()),
  created: v.optional(v.string()),
});

const CollectionSchemaResponse = v.object({
  items: v.array(CollectionBaseSchema),
});

// Схема для группы коллекций в пользовательских данных
const UserGroupSchema = v.object({
  title: v.string(),
  hidden: v.boolean(),
  sort: v.number(),
  collections: v.array(v.number()), // массив ID коллекций в порядке сортировки
});

// Схема для пользователя
const UserSchema = v.object({
  _id: v.number(),
  groups: v.array(UserGroupSchema),
});

const UserSchemaResponse = v.object({
  user: UserSchema,
});

// Типы, выведенные из схем
export type RaindropItemType = v.InferOutput<typeof RaindropItemSchema>;
export type CollectionType = Omit<v.InferOutput<typeof CollectionBaseSchema>, "children"> & {
  children?: CollectionType[];
};
export type UserType = v.InferOutput<typeof UserSchema>;

// Функция для преобразования полной коллекции в упрощенную
export function safeParseCollectionResponse(data: unknown): CollectionType[] {
  // Валидируем базовые поля (без children чтобы избежать циклических ссылок)
  const result = v.safeParse(CollectionSchemaResponse, data);

  if (!result.success) {
    console.error("Collection validation failed:", {
      issues: result.issues,
      data: data,
    });
    throw new Error(`Invalid collection format: ${result.issues.map((i) => i.message).join(", ")}`);
  }

  // Возвращаем валидированные данные с правильной обработкой parent
  return result.output.items.map((collection) => ({
    ...collection,
    parent: collection?.parent || undefined, // Преобразуем null в undefined
  })) as CollectionType[];
}

// Функция для преобразования полного raindrop в упрощенный
export function safeParseRaindropResponse(data: unknown): RaindropItemType[] {
  // Валидируем через схему
  const result = v.safeParse(RaindropItemSchemaResponse, data);

  if (!result.success) {
    console.error("Raindrop validation failed:", {
      issues: result.issues,
      data: data,
    });
    throw new Error(`Invalid raindrop format: ${result.issues.map((i) => i.message).join(", ")}`);
  }

  return result.output.items;
}

export function safeParseUserResponse(data: unknown): UserType {
  // Валидируем через схему
  const result = v.safeParse(UserSchemaResponse, data);

  if (!result.success) {
    console.error("User validation failed:", {
      issues: result.issues,
      data,
    });
    throw new Error(`Invalid raindrop format: ${result.issues.map((i) => i.message).join(", ")}`);
  }

  return result.output.user;
}
