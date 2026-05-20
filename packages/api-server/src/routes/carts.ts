import { Elysia, t } from "elysia";
import { FAKE_STORE_API, FAKE_STORE_HEADERS } from "../constants";
import { CartSchema } from "../schemas";

export const cartsRoutes = new Elysia({ prefix: "/api/carts" })
  .get(
    "/",
    async () => {
      const res = await fetch(`${FAKE_STORE_API}/carts`);
      return res.json();
    },
    { response: t.Array(CartSchema) },
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const res = await fetch(`${FAKE_STORE_API}/carts/${id}`);
      return res.json();
    },
    { params: t.Object({ id: t.String() }), response: CartSchema },
  )
  .post("/", async ({ body }) => {
    const res = await fetch(`${FAKE_STORE_API}/carts`, {
      method: "POST",
      headers: FAKE_STORE_HEADERS,
      body: JSON.stringify(body),
    });
    return res.json();
  })
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      const res = await fetch(`${FAKE_STORE_API}/carts/${id}`, {
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
      const res = await fetch(`${FAKE_STORE_API}/carts/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    { params: t.Object({ id: t.String() }) },
  );
