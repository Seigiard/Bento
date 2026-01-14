import * as v from "valibot";

const ParentSchema = v.object({
  $id: v.number(),
});

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

const UserGroupSchema = v.object({
  title: v.string(),
  hidden: v.boolean(),
  sort: v.number(),
  collections: v.array(v.number()),
});

const UserSchema = v.object({
  _id: v.number(),
  groups: v.array(UserGroupSchema),
});

const UserSchemaResponse = v.object({
  user: UserSchema,
});

export type RaindropItemType = v.InferOutput<typeof RaindropItemSchema>;
export type CollectionType = Omit<v.InferOutput<typeof CollectionBaseSchema>, "children"> & {
  children?: CollectionType[];
};
export type UserType = v.InferOutput<typeof UserSchema>;

export function safeParseCollectionResponse(data: unknown): CollectionType[] {
  const result = v.safeParse(CollectionSchemaResponse, data);

  if (!result.success) {
    console.error("Collection validation failed:", {
      issues: result.issues,
      data: data,
    });
    throw new Error(`Invalid collection format: ${result.issues.map((i) => i.message).join(", ")}`);
  }

  return result.output.items.map((collection) => ({
    ...collection,
    parent: collection?.parent || undefined,
  })) as CollectionType[];
}

export function safeParseRaindropResponse(data: unknown): RaindropItemType[] {
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
  const result = v.safeParse(UserSchemaResponse, data);

  if (!result.success) {
    console.error("User validation failed:", {
      issues: result.issues,
      data,
    });
    throw new Error(`Invalid user format: ${result.issues.map((i) => i.message).join(", ")}`);
  }

  return result.output.user;
}
