import { desc } from "drizzle-orm";
import { Elysia } from "elysia";
import { JSONING_API } from "../constants";
import { DashboardMetricsSchema } from "../schemas";

export const dashboardRoutes = new Elysia({ prefix: "/api/dashboard" }).get(
	"/metrics",
	async () => {
		const [products, carts, fakeUsers, { db, schema }] = await Promise.all([
			fetch(`${JSONING_API}/products`).then((r) => r.json()),
			fetch(`${JSONING_API}/carts`).then((r) => r.json()),
			fetch(`${JSONING_API}/users`).then((r) => r.json()),
			import("@repo/db"),
		]);

		const allOrders = await db.select().from(schema.order).all();
		const recentAuthUsers = await db
			.select({
				id: schema.user.id,
				name: schema.user.name,
				email: schema.user.email,
				image: schema.user.image,
				createdAt: schema.user.createdAt,
			})
			.from(schema.user)
			.orderBy(desc(schema.user.createdAt))
			.limit(5)
			.all();

		const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
		const totalOrders = allOrders.length;
		const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

		const categories = [
			...new Set(products.map((p: any) => p.category)),
		].map((name) => ({
			name,
			count: products.filter((p: any) => p.category === name).length,
		}));
		const prices = products.map((p: any) => p.price);
		const ratings = products
			.filter((p: any) => p.rating)
			.map((p: any) => p.rating.rate);
		const sortedByRating = [...products].sort(
			(a: any, b: any) => b.rating.rate - a.rating.rate,
		);

		const totalCarts = carts.length;

		return {
			productStats: {
				total: products.length,
				categories,
				avgPrice: prices.length
					? Math.round(
							(prices.reduce((a: number, b: number) => a + b, 0) /
								prices.length) *
								100,
						) / 100
					: 0,
				avgRating: ratings.length
					? Math.round(
							(ratings.reduce((a: number, b: number) => a + b, 0) /
								ratings.length) *
								100,
						) / 100
					: 0,
				minPrice: prices.length ? Math.min(...prices) : 0,
				maxPrice: prices.length ? Math.max(...prices) : 0,
			},
			revenue: {
				totalOrders,
				totalRevenue: Math.round(totalRevenue * 100) / 100,
				avgOrderValue: Math.round(avgOrderValue * 100) / 100,
			},
			topRated: sortedByRating.slice(0, 5),
			recentProducts: products.slice(0, 5),
			recentUsers: recentAuthUsers.map((u: any) => ({
				...u,
				createdAt:
					u.createdAt instanceof Date
						? u.createdAt.toISOString()
						: String(u.createdAt),
			})),
			cartStats: {
				totalCarts,
				avgItems: 0,
			},
			userCount: fakeUsers.length,
		} as any;
	},
	{
		response: DashboardMetricsSchema,
	},
);
