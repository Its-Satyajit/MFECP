import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { getSession, type SessionData } from "../lib/session";

function ProtectedLayout() {
	const router = useRouter();
	const { data: session, isLoading } = useQuery<SessionData | null>({
		queryKey: ["session"],
		queryFn: () => getSession(),
		retry: false,
	});

	useEffect(() => {
		if (!isLoading && !session?.user) {
			void router.navigate({
				to: "/login",
				search: { redirect: window.location.pathname },
			});
		}
	}, [session, isLoading, router]);

	return <Outlet />;
}

export const Route = createFileRoute("/_protected")({
	component: ProtectedLayout,
});
