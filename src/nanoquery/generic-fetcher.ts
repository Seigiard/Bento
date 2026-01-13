import { nanoquery } from "@nanostores/query";

const [createGenericFetcherStore, , { revalidateKeys }] = nanoquery();

export { createGenericFetcherStore, revalidateKeys };
