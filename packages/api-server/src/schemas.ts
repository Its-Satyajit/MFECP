import { t } from "elysia";

export const ProductSchema = t.Object({
	id: t.String(),
	name: t.String(),
	price: t.Number(),
	description: t.String(),
	category: t.String(),
	stock: t.Number(),
	sku: t.String(),
	image_url: t.String(),
	rating: t.Object({
		rate: t.Number(),
		count: t.Number(),
	}),
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

export const JsoningCartSchema = t.Object({
	id: t.String(),
	userId: t.Union([t.Null(), t.Number()]),
	items: t.Array(
		t.Object({
			productId: t.Number(),
			quantity: t.Number(),
		}),
	),
	date: t.String(),
	status: t.String(),
});

export const JsoningUserSchema = t.Object({
	id: t.String(),
	firstname: t.String(),
	lastname: t.String(),
	email: t.String(),
	username: t.String(),
	address: t.String(),
	city: t.String(),
	state: t.String(),
	zipcode: t.String(),
	country: t.String(),
	phone: t.String(),
});

export const DashboardMetricsSchema = t.Object({
	productStats: t.Object({
		total: t.Number(),
		categories: t.Array(
			t.Object({ name: t.String(), count: t.Number() }),
		),
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
