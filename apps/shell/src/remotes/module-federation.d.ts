declare module "auth/auth" {
	export const LoginPage: React.ComponentType;
	export const RegisterPage: React.ComponentType;
}

declare module "product/product" {
	export const ProductsPage: React.ComponentType;
	export const ProductPage: React.ComponentType;
}

declare module "cart/cart" {
	export const CartPage: React.ComponentType;
	export const CheckoutPage: React.ComponentType;
}

declare module "order/order" {
	export const OrdersPage: React.ComponentType;
}

declare module "dashboard/dashboard" {
	export const DashboardPage: React.ComponentType;
}
