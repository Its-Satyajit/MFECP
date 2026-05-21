import { spawn, execSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SHELL_DIR = resolve(ROOT, "apps/shell");
const DB_DIR = resolve(ROOT, "packages/db");

const MFES = [
	{ port: 3001, dir: resolve(ROOT, "apps/auth-mf") },
	{ port: 3002, dir: resolve(ROOT, "apps/product-app") },
	{ port: 3003, dir: resolve(ROOT, "apps/cart-app") },
	{ port: 3004, dir: resolve(ROOT, "apps/order-app") },
	{ port: 3005, dir: resolve(ROOT, "apps/dashboard-mf") },
];

const children = [];

function start(cmd, args, opts) {
	const child = spawn(cmd, args, { stdio: "inherit", shell: true, ...opts });
	children.push(child);
	return child;
}

function onExit() {
	for (const child of children) child.kill();
	process.exit();
}

process.on("SIGINT", onExit);
process.on("SIGTERM", onExit);

// Run pending DB migrations
console.log("\n[SHELL] Running database migrations...\n");
try {
	execSync("pnpm exec drizzle-kit migrate", { cwd: DB_DIR, stdio: "inherit" });
} catch {
	console.log("[SHELL] Migration skipped or already applied.");
}

// Sync the DB to the shell's working directory so both
// the built server (process.cwd() == SHELL_DIR) and the
// migration (ran from DB_DIR) use the same database.
const dbSrc = resolve(DB_DIR, "local.db");
const dbDst = resolve(SHELL_DIR, "local.db");
if (existsSync(dbSrc)) {
	copyFileSync(dbSrc, dbDst);
	console.log("[SHELL] Database synced to shell directory.");
}

// Start MFE preview servers
for (const mfe of MFES) {
	start("pnpm exec vite preview --port " + mfe.port, [], { cwd: mfe.dir });
}

// Give MFEs a moment to start, then launch shell on port 3000
setTimeout(() => {
	start("pnpm exec vite preview --port 3000", [], { cwd: SHELL_DIR });
}, 2000);
