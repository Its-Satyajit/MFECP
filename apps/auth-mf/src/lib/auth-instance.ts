import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db, schema } from "@repo/db";
import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "../../env";

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema,
	}),
	plugins: [tanstackStartCookies()],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID ?? "",
			clientSecret: env.GITHUB_CLIENT_SECRET ?? "",
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
		},
		facebook: {
			clientId: env.FACEBOOK_CLIENT_ID ?? "",
			clientSecret: env.FACEBOOK_CLIENT_SECRET ?? "",
		},
	},
});
