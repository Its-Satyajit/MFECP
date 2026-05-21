import { createEnv as createT3Env } from "@t3-oss/env-core";
import { z } from "zod";

export { createT3Env as createEnv };

const betterAuthSecret = z.string().min(1);
const betterAuthUrl = z.string().url();
const githubClientId = z.string().optional();
const githubClientSecret = z.string().optional();
const googleClientId = z.string().optional();
const googleClientSecret = z.string().optional();
const facebookClientId = z.string().optional();
const facebookClientSecret = z.string().optional();
const databaseUrl = z.string().optional();
const tursoDatabaseUrl = z.string().url().optional();
const tursoAuthToken = z.string().optional();

export const authServerSchema = {
	BETTER_AUTH_SECRET: betterAuthSecret,
	BETTER_AUTH_URL: betterAuthUrl,
	GITHUB_CLIENT_ID: githubClientId,
	GITHUB_CLIENT_SECRET: githubClientSecret,
	GOOGLE_CLIENT_ID: googleClientId,
	GOOGLE_CLIENT_SECRET: googleClientSecret,
	FACEBOOK_CLIENT_ID: facebookClientId,
	FACEBOOK_CLIENT_SECRET: facebookClientSecret,
};

export const dbServerSchema = {
	DATABASE_URL: databaseUrl,
	TURSO_DATABASE_URL: tursoDatabaseUrl,
	TURSO_AUTH_TOKEN: tursoAuthToken,
};
