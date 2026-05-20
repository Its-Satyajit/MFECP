import { OrdersPage } from "@repo/dashboard-mf";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/orders")({
	component: OrdersPage,
});
