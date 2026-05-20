export interface User {
	id: string;
	email: string;
	name?: string;
	image?: string;
}

export interface Product {
	id: number;
	title: string;
	price: number;
	description: string;
	category: string;
	image: string;
	rating?: {
		rate: number;
		count: number;
	};
}

export interface Order {
	id: string;
	userId: string;
	total: number;
	status: string;
	shippingName: string;
	shippingEmail: string;
	shippingAddress: string;
	shippingCity: string;
	shippingZip: string;
	createdAt: Date;
	items: OrderItem[];
}

export interface OrderItem {
	id: string;
	orderId: string;
	productId: number;
	title: string;
	price: number;
	image: string;
	quantity: number;
}

export interface DashboardMetrics {
	productStats: {
		total: number;
		categories: Array<{ name: string; count: number }>;
		avgPrice: number;
		avgRating: number;
		minPrice: number;
		maxPrice: number;
	};
	revenue: {
		totalOrders: number;
		totalRevenue: number;
		avgOrderValue: number;
	};
	topRated: Product[];
	recentProducts: Product[];
	recentUsers: Array<{
		id: string;
		name: string;
		email: string;
		image: string | null;
		createdAt: string;
	}>;
	cartStats: {
		totalCarts: number;
		avgItems: number;
	};
	userCount: number;
}
