import { federation } from "@module-federation/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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
		tailwindcss(),
		tanstackStart(),
		viteReact({
			babel: {
				presets: [reactCompilerPreset()],
			},
		}),
	],
});
