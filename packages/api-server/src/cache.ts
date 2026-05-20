import { Elysia } from "elysia";
import { LRUCache } from "lru-cache";

export const store = new LRUCache<string, object>({
  max: 500,
  ttl: 1000 * 60 * 5,
});

export const cachePlugin = new Elysia({ name: "cache" }).decorate("cache", store);
