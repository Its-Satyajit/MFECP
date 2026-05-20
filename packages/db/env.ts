import { createEnv, dbServerSchema } from "@repo/env";

export const env = createEnv({
	server: dbServerSchema,
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
