import { Elysia, t } from "elysia";
import { JSONING_API } from "../constants";
import { JsoningUserSchema } from "../schemas";

export const usersRoutes = new Elysia({ prefix: "/api/users" })
	.get(
		"/",
		async () => {
			const res = await fetch(`${JSONING_API}/users`);
			return res.json();
		},
		{ response: t.Array(JsoningUserSchema) },
	)
	.get(
		"/:id",
		async ({ params: { id } }) => {
			const res = await fetch(`${JSONING_API}/users/${id}`);
			return res.json();
		},
		{ params: t.Object({ id: t.String() }), response: JsoningUserSchema },
	);
