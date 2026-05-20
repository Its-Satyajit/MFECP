import { clientLazy } from "./client-lazy";
import { loadRemote } from "@module-federation/enhanced/runtime";

export const OrdersPage = clientLazy(() =>
	loadRemote("order/order").then((m: any) => ({ default: m.OrdersPage || m.default?.OrdersPage || m.default }))
);
