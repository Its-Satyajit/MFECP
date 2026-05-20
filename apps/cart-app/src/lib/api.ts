import { treaty } from "@elysia/eden";
import type { App } from "@repo/api-server";

const baseUrl =
	typeof window !== "undefined"
		? window.location.origin
		: "http://localhost:3000";

export const treatyClient = treaty<App>(baseUrl, {
	fetch: {
		credentials: "include",
	},
});
