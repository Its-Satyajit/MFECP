import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { RegisterPage } from "../remotes/auth";
import { getSession, type SessionData } from "../lib/session";

function RegisterRoute() {
	const router = useRouter();
	const { data: session } = useQuery<SessionData | null>({
		queryKey: ["session"],
		queryFn: () => getSession(),
		retry: false,
	});

	useEffect(() => {
		if (session?.user) {
			void router.navigate({ to: "/dashboard" });
		}
	}, [session, router]);

	return <RegisterPage />;
}

export const Route = createFileRoute("/register")({
	component: RegisterRoute,
});
