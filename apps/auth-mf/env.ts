import { authServerSchema, createEnv } from "@repo/env";

export const env = createEnv({
	server: authServerSchema,
	runtimeEnv: typeof process !== "undefined" ? process.env : {},
	emptyStringAsUndefined: true,
});
