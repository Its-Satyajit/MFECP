import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
	baseURL:
		typeof window !== "undefined"
			? `${window.location.protocol}//${window.location.host}`
			: "http://localhost:3000",
});
