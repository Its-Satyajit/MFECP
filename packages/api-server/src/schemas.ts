import { t } from "elysia";

export const ProductSchema = t.Object({
	id: t.Number(),
	title: t.String(),
	price: t.Number(),
	description: t.String(),
	category: t.String(),
	image: t.String(),
	rating: t.Any(),
});

export const OrderItemSchema = t.Object({
	id: t.String(),
	orderId: t.String(),
	productId: t.Number(),
	title: t.String(),
	price: t.Number(),
	image: t.String(),
	quantity: t.Number(),
});

export const OrderSchema = t.Object({
	id: t.String(),
	userId: t.String(),
	total: t.Number(),
	status: t.String(),
	shippingName: t.String(),
	shippingEmail: t.String(),
	shippingAddress: t.String(),
	shippingCity: t.String(),
	shippingZip: t.String(),
	createdAt: t.Any(),
	items: t.Array(OrderItemSchema),
});

export const CartSchema = t.Object({
	id: t.Number(),
	userId: t.Number(),
	products: t.Array(ProductSchema),
});

export const UserSchema = t.Object({
	id: t.Number(),
	username: t.String(),
	email: t.String(),
	password: t.String(),
});

export const DashboardMetricsSchema = t.Object({
	productStats: t.Object({
		total: t.Number(),
		categories: t.Array(t.Object({ name: t.String(), count: t.Number() })),
		avgPrice: t.Number(),
		avgRating: t.Number(),
		minPrice: t.Number(),
		maxPrice: t.Number(),
	}),
	revenue: t.Object({
		totalOrders: t.Number(),
		totalRevenue: t.Number(),
		avgOrderValue: t.Number(),
	}),
	topRated: t.Array(ProductSchema),
	recentProducts: t.Array(ProductSchema),
	recentUsers: t.Array(
		t.Object({
			id: t.String(),
			name: t.String(),
			email: t.String(),
			image: t.Any(),
			createdAt: t.String(),
		}),
	),
	cartStats: t.Object({
		totalCarts: t.Number(),
		avgItems: t.Number(),
	}),
	userCount: t.Number(),
});
