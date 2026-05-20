import { createEnv, shellClientSchema, shellServerSchema } from "@repo/env";

export const env = createEnv({
	server: shellServerSchema,
	clientPrefix: "VITE_",
	client: shellClientSchema,
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});
