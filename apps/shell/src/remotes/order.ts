import { clientLazy } from "./client-lazy";

export const OrdersPage = clientLazy(
	() => import("order/order").then((m) => ({ default: m.OrdersPage })),
);
