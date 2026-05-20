import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckoutPage } from "../remotes/cart";
import { getSession, type SessionData } from "../lib/session";

function CheckoutRoute() {
	const router = useRouter();
	const { data: session, isLoading } = useQuery<SessionData | null>({
		queryKey: ["session"],
		queryFn: () => getSession(),
		retry: false,
	});

	useEffect(() => {
		if (!isLoading && !session) {
			void router.navigate({
				to: "/login",
				search: { redirect: window.location.pathname },
			});
		}
	}, [session, isLoading, router]);

	return <CheckoutPage />;
}

export const Route = createFileRoute("/checkout")({
	component: CheckoutRoute,
});
