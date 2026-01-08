import { nanoquery } from "@nanostores/query";
import { cache } from "./cache";

const [createGenericFetcherStore, , { revalidateKeys }] = nanoquery({ cache });

export { createGenericFetcherStore, revalidateKeys };
