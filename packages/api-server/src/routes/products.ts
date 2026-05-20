import { Elysia, t } from "elysia";
import { cachePlugin } from "../cache";
import { JSONING_API } from "../constants";
import { ProductSchema } from "../schemas";

export const productsRoutes = new Elysia({ prefix: "/api/products" })
	.use(cachePlugin)
	.get(
		"/",
		async ({ cache }) => {
			const key = "/api/products";
			const cached = cache.get(key);
			if (cached !== undefined) return cached;
			const res = await fetch(`${JSONING_API}/products`);
			const data = await res.json();
			cache.set(key, data);
			return data;
		},
		{ response: t.Array(ProductSchema) },
	)
	.get(
		"/:id",
		async ({ cache, params: { id } }) => {
			const key = `/api/products/${id}`;
			const cached = cache.get(key);
			if (cached !== undefined) return cached;
			const res = await fetch(`${JSONING_API}/products/${id}`);
			const data = await res.json();
			cache.set(key, data);
			return data;
		},
		{ params: t.Object({ id: t.String() }), response: ProductSchema },
	);
