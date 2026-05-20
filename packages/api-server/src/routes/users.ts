import { Elysia, t } from "elysia";
import { FAKE_STORE_API, FAKE_STORE_HEADERS } from "../constants";
import { UserSchema } from "../schemas";

export const usersRoutes = new Elysia({ prefix: "/api/users" })
  .get(
    "/",
    async () => {
      const res = await fetch(`${FAKE_STORE_API}/users`);
      return res.json();
    },
    { response: t.Array(UserSchema) },
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const res = await fetch(`${FAKE_STORE_API}/users/${id}`);
      return res.json();
    },
    { params: t.Object({ id: t.String() }), response: UserSchema },
  )
  .post("/", async ({ body }) => {
    const res = await fetch(`${FAKE_STORE_API}/users`, {
      method: "POST",
      headers: FAKE_STORE_HEADERS,
      body: JSON.stringify(body),
    });
    return res.json();
  })
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      const res = await fetch(`${FAKE_STORE_API}/users/${id}`, {
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
      const res = await fetch(`${FAKE_STORE_API}/users/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    { params: t.Object({ id: t.String() }) },
  );
