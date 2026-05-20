import { clientLazy, loadMfRemote } from "./client-lazy";

export const OrdersPage = clientLazy(() =>
	loadMfRemote("order/order").then((m: any) => ({ default: m.OrdersPage || m.default?.OrdersPage || m.default }))
);
