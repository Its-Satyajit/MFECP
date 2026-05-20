import { federation } from "@module-federation/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

function fixMfBundlePlugin(): Plugin {
	return {
		name: "fix-mf-bundle",
		generateBundle(_, bundle) {
			for (const chunk of Object.values(bundle)) {
				if (chunk.type !== "chunk") continue;
				if (chunk.isEntry && chunk.name !== "index") {
					(chunk as Record<string, unknown>).isEntry = false;
				}
				if (chunk.fileName === "server.js") {
					const m = chunk.code.match(
						/await Promise\.all\(\[\]\);\n?\s*\}\)\(\)\.then\(\(\)\s*=>\s*import\("\.\/assets\/server-([^"]+)"\)\);/,
					);
					if (m) {
						chunk.code = chunk.code.replace(
							"export {};",
							`export { default } from "./assets/server-${m[1]}";`,
						);
					}
				}
			}
		},
	};
}

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		federation({
			name: "shell",
			filename: "remoteEntry.js",
			manifest: true,
			exposes: {
				"./dummy": "./src/env.ts",
			},
			remotes: {
				auth: {
					type: "module",
					name: "auth",
					entry: "http://localhost:3001/remoteEntry.js",
				},
				product: {
					type: "module",
					name: "product",
					entry: "http://localhost:3002/remoteEntry.js",
				},
				cart: {
					type: "module",
					name: "cart",
					entry: "http://localhost:3003/remoteEntry.js",
				},
				order: {
					type: "module",
					name: "order",
					entry: "http://localhost:3004/remoteEntry.js",
				},
				dashboard: {
					type: "module",
					name: "dashboard",
					entry: "http://localhost:3005/remoteEntry.js",
				},
			},
			shared: {
				react: { singleton: true },
				"react-dom": { singleton: true },
				"react/jsx-runtime": { singleton: true },
				"react/jsx-dev-runtime": { singleton: true },
				"react-dom/client": { singleton: true },
				"@repo/cart-store": { singleton: true },
				"@tanstack/react-router": { singleton: true },
				"@tanstack/react-query": { singleton: true },
				"@tanstack/react-form": { singleton: true },
			},
			dts: false,
		}),
		fixMfBundlePlugin(),
		tailwindcss(),
		tanstackStart(),
		viteReact({
			babel: {
				presets: [reactCompilerPreset()],
			},
		}),
	],
});
