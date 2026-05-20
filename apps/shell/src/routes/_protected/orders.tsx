import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "../../remotes/order";

export const Route = createFileRoute("/_protected/orders")({
	component: OrdersPage,
});
