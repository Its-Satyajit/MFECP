import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "../remotes/cart";

export const Route = createFileRoute("/cart")({
	component: CartPage,
});
