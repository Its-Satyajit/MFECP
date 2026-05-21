export interface User {
	id: string;
	email: string;
	name?: string;
	image?: string;
}

export interface Product {
	id: string;
	name: string;
	price: number;
	description: string;
	category: string;
	stock: number;
	sku: string;
	image_url: string;
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

export interface JsoningProduct {
	id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	stock: number;
	sku: string;
	image_url: string;
	rating: {
		rate: number;
		count: number;
	};
}

export interface JsoningUser {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	username: string;
	address: string;
	city: string;
	state: string;
	zipcode: string;
	country: string;
	phone: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

export interface JsoningCart {
	id: string;
	userId: null | number;
	items: Array<{
		productId: number;
		quantity: number;
	}>;
	date: string;
	status: string;
}

export async function retryGet<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < maxRetries) await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
  throw lastError;
}
