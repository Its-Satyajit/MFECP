import { clientLazy, loadMfRemote } from "./client-lazy";

export const CartPage = clientLazy(() =>
	loadMfRemote("cart/cart").then((m: any) => ({ default: m.CartPage || m.default?.CartPage || m.default }))
);

export const CheckoutPage = clientLazy(() =>
	loadMfRemote("cart/cart").then((m: any) => ({ default: m.CheckoutPage || m.default?.CheckoutPage || m.default }))
);
