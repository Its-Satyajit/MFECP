import { resolve } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./src/schema";

const url = `file:${resolve(process.cwd(), "local.db")}`;

export const db = drizzle(createClient({ url }));
export { schema };