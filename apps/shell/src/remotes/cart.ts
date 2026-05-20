import { clientLazy } from "./client-lazy";
import { loadRemote } from "@module-federation/enhanced/runtime";

export const CartPage = clientLazy(() =>
	loadRemote("cart/cart").then((m: any) => ({ default: m.CartPage || m.default?.CartPage || m.default }))
);

export const CheckoutPage = clientLazy(() =>
	loadRemote("cart/cart").then((m: any) => ({ default: m.CheckoutPage || m.default?.CheckoutPage || m.default }))
);
