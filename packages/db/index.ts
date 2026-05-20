import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "./env";
import * as schema from "./src/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createDb() {
	if (env.TURSO_DATABASE_URL) {
		const client = createClient({
			url: env.TURSO_DATABASE_URL,
			authToken: env.TURSO_AUTH_TOKEN,
		});
		return drizzle(client);
	}

	const client = createClient({
		url: `file:${resolve(__dirname, "local.db")}`,
	});
	return drizzle(client);
}

export const db = createDb();
export { schema };
