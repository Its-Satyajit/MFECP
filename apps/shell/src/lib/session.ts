import { env } from "../env";

export interface SessionData {
	user: { id: string; name: string; email: string; image?: string | null };
	session: { id: string; expiresAt: Date; token: string };
}

const baseUrl =
	typeof window !== "undefined"
		? window.location.origin
		: env.SERVER_URL || "http://localhost:3000";

export async function getSession(request?: Request): Promise<SessionData | null> {
	const headers: Record<string, string> = {
		"content-type": "application/json",
	};
	const cookie = (request as Request)?.headers?.get("cookie");
	if (cookie) {
		headers.cookie = cookie;
	}
	const res = await fetch(`${baseUrl}/api/session`, { headers });
	if (!res.ok || res.status === 204) return null;
	return (await res.json()) as SessionData | null;
}
