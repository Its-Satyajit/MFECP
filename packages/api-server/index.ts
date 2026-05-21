import { auth } from "@repo/auth-mf/auth-instance";
import { Elysia } from "elysia";
import { cachePlugin } from "./src/cache";
import { cartsRoutes } from "./src/routes/carts";
import { dashboardRoutes } from "./src/routes/dashboard";
import { ordersRoutes } from "./src/routes/orders";
import { productsRoutes } from "./src/routes/products";
import { usersRoutes } from "./src/routes/users";

export const app = new Elysia()
	.use(cachePlugin)
	.mount(auth.handler)
	.get("/api/session", async ({ request }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});
		if (!session) return new Response(null, { status: 204 });
		return session;
	})
	.use(productsRoutes)
	.use(cartsRoutes)
	.use(usersRoutes)
	.use(ordersRoutes)
	.use(dashboardRoutes);

export type App = typeof app;
