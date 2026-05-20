import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "./env";
import * as schema from "./src/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createDb() {
	const url =
		env.DATABASE_URL ??
		env.TURSO_DATABASE_URL ??
		`file:${resolve(__dirname, "local.db")}`;

	const opts: Record<string, string> = { url };
	if (env.TURSO_AUTH_TOKEN) opts.authToken = env.TURSO_AUTH_TOKEN;

	return drizzle(createClient(opts));
}

export const db = createDb();
export { schema };
