import { createEnv, dbServerSchema } from "@repo/env";

export const env = createEnv({
	server: dbServerSchema,
	runtimeEnv: typeof process !== "undefined" ? process.env : {},
	emptyStringAsUndefined: true,
});
