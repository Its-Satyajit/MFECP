import { Elysia, t } from "elysia";
import { cachePlugin } from "../cache";
import { FAKE_STORE_API, FAKE_STORE_HEADERS } from "../constants";
import { ProductSchema } from "../schemas";

export const productsRoutes = new Elysia({ prefix: "/api/products" })
	.use(cachePlugin)
	.get(
		"/",
		async ({ cache }) => {
			const key = "/api/products";
			const cached = cache.get(key);
			if (cached !== undefined) return cached;
			const res = await fetch(`${FAKE_STORE_API}/products`);
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
			const res = await fetch(`${FAKE_STORE_API}/products/${id}`);
			const data = await res.json();
			cache.set(key, data);
			return data;
		},
		{ params: t.Object({ id: t.String() }), response: ProductSchema },
	)
	.post("/", async ({ body }) => {
		const res = await fetch(`${FAKE_STORE_API}/products`, {
			method: "POST",
			headers: FAKE_STORE_HEADERS,
			body: JSON.stringify(body),
		});
		return res.json();
	})
	.put(
		"/:id",
		async ({ params: { id }, body }) => {
			const res = await fetch(`${FAKE_STORE_API}/products/${id}`, {
				method: "PUT",
				headers: FAKE_STORE_HEADERS,
				body: JSON.stringify(body),
			});
			return res.json();
		},
		{ params: t.Object({ id: t.String() }) },
	)
	.delete(
		"/:id",
		async ({ params: { id } }) => {
			const res = await fetch(`${FAKE_STORE_API}/products/${id}`, {
				method: "DELETE",
			});
			return res.json();
		},
		{ params: t.Object({ id: t.String() }) },
	);
