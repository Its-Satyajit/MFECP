import { Elysia, t } from "elysia";
import { JSONING_API } from "../constants";
import { JsoningCartSchema } from "../schemas";

export const cartsRoutes = new Elysia({ prefix: "/api/carts" })
	.get(
		"/",
		async () => {
			const res = await fetch(`${JSONING_API}/carts`);
			return res.json();
		},
		{ response: t.Array(JsoningCartSchema) },
	)
	.get(
		"/:id",
		async ({ params: { id } }) => {
			const res = await fetch(`${JSONING_API}/carts/${id}`);
			return res.json();
		},
		{ params: t.Object({ id: t.String() }), response: JsoningCartSchema },
	);
