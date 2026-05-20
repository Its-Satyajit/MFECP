import { clientLazy } from "./client-lazy";

export const CartPage = clientLazy(
	() => import("cart/cart").then((m) => ({ default: m.CartPage })),
);

export const CheckoutPage = clientLazy(
	() => import("cart/cart").then((m) => ({ default: m.CheckoutPage })),
);
