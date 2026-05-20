import { auth } from "@repo/auth-mf/auth-instance";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { OrderSchema } from "../schemas";

export const ordersRoutes = new Elysia({ prefix: "/api/orders" })
	.post("/", async ({ request, body, set }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});
		if (!session) {
			set.status = 401;
			return { error: "Unauthorized" };
		}

		const data = body as {
			total: number;
			shipping: {
				name: string;
				email: string;
				address: string;
				city: string;
				zip: string;
			};
			items: Array<{
				id: number;
				title: string;
				price: number;
				image: string;
				quantity: number;
			}>;
		};

		const { db, schema } = await import("@repo/db");
		const orderId = crypto.randomUUID();

		await db.insert(schema.order).values({
			id: orderId,
			userId: session.user.id,
			total: data.total,
			status: "confirmed",
			shippingName: data.shipping.name,
			shippingEmail: data.shipping.email,
			shippingAddress: data.shipping.address,
			shippingCity: data.shipping.city,
			shippingZip: data.shipping.zip,
			createdAt: new Date(),
		});

		for (const item of data.items) {
			await db.insert(schema.orderItem).values({
				id: crypto.randomUUID(),
				orderId,
				productId: item.id,
				title: item.title,
				price: item.price,
				image: item.image,
				quantity: item.quantity,
			});
		}

		return { orderId };
	})
	.get(
		"/",
		async ({ request }) => {
			const session = await auth.api.getSession({
				headers: request.headers,
			});
			if (!session) return [];

			const { db, schema } = await import("@repo/db");

			const orders = await db
				.select()
				.from(schema.order)
				.where(eq(schema.order.userId, session.user.id))
				.all();

			const result: any[] = [];
			for (const order of orders) {
				const items = await db
					.select()
					.from(schema.orderItem)
					.where(eq(schema.orderItem.orderId, order.id))
					.all();
				result.push({ ...order, items });
			}

			return result;
		},
		{
			response: t.Array(OrderSchema),
		},
	);
