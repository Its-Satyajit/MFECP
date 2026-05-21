import { createEnv, shellClientSchema, shellServerSchema } from "@repo/env";

export const env = createEnv({
	server: shellServerSchema,
	clientPrefix: "VITE_",
	client: shellClientSchema,
	runtimeEnv: typeof process !== "undefined" ? { ...process.env, ...import.meta.env } : import.meta.env,
	emptyStringAsUndefined: true,
});
