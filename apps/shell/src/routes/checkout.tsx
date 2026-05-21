import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "../lib/session";
import { CheckoutPage } from "../remotes/cart";

export const Route = createFileRoute("/checkout")({
	beforeLoad: async ({ location }) => {
		const session = await getSession();
		if (!session?.user) {
			throw redirect({
				to: "/login",
				search: { redirect: location.pathname },
			});
		}
	},
	component: CheckoutPage,
});
