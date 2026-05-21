import { createEnv, authServerSchema, dbServerSchema } from "@repo/env";
import { z } from "zod";

const jsoningApiUrl = z.string().url().default("https://api.jsoning.com/mock/public");
const serverUrl = z.string().url().optional();
const viteApiUrl = z.string().url().optional();
const viteAppTitle = z.string().min(1).optional();
const remoteAuthUrl = z.string().url().default("http://localhost:3001");
const remoteProductUrl = z.string().url().default("http://localhost:3002");
const remoteCartUrl = z.string().url().default("http://localhost:3003");
const remoteOrderUrl = z.string().url().default("http://localhost:3004");
const remoteDashboardUrl = z.string().url().default("http://localhost:3005");

const shellServerSchema = {
	...authServerSchema,
	...dbServerSchema,
	JSONING_API_URL: jsoningApiUrl,
	SERVER_URL: serverUrl,
};

const shellClientSchema = {
	VITE_APP_TITLE: viteAppTitle,
	VITE_API_URL: viteApiUrl,
	VITE_REMOTE_AUTH_URL: remoteAuthUrl,
	VITE_REMOTE_PRODUCT_URL: remoteProductUrl,
	VITE_REMOTE_CART_URL: remoteCartUrl,
	VITE_REMOTE_ORDER_URL: remoteOrderUrl,
	VITE_REMOTE_DASHBOARD_URL: remoteDashboardUrl,
};

export const env = createEnv({
	server: shellServerSchema,
	clientPrefix: "VITE_",
	client: shellClientSchema,
	runtimeEnv: typeof process !== "undefined" ? { ...process.env, ...import.meta.env } : import.meta.env,
	emptyStringAsUndefined: true,
});
