import { authServerSchema, createEnv } from "@repo/env";

export const env = createEnv({
	server: authServerSchema,
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
