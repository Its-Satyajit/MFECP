import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "../lib/session";

export const Route = createFileRoute("/_protected")({
	beforeLoad: async ({ location }) => {
		const session = await getSession();
		if (!session?.user) {
			throw redirect({
				to: "/login",
				search: { redirect: location.pathname },
			});
		}
	},
	component: () => <Outlet />,
});
