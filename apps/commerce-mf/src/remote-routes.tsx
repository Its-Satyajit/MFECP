import { CartPage } from "./features/cart";
import { CheckoutPage } from "./features/checkout";
import { ProductPage } from "./features/product";
import { ProductsPage } from "./features/products";
import {
	selectTotalItems,
	selectTotalPrice,
	useCartStore,
} from "./lib/cart-store";

export type { CartItem } from "./lib/cart-store";

export {
	ProductsPage,
	ProductPage,
	CartPage,
	CheckoutPage,
	useCartStore,
	selectTotalItems,
	selectTotalPrice,
};

export const commerceRoutes = {
	products: ProductsPage,
	product: ProductPage,
	cart: CartPage,
	checkout: CheckoutPage,
};
