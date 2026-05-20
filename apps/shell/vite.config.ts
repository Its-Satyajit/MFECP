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
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		federation({
			name: "shell",
			remotes: {
				auth: "http://localhost:3001/remoteEntry.js",
				product: "http://localhost:3002/remoteEntry.js",
				cart: "http://localhost:3003/remoteEntry.js",
				order: "http://localhost:3004/remoteEntry.js",
				dashboard: "http://localhost:3005/remoteEntry.js",
			},
			shared: {
				react: { singleton: true },
				"react-dom": { singleton: true },
				"@repo/cart-store": { singleton: true },
			},
			dts: false,
		}),
		babel({ presets: [reactCompilerPreset()] }),
	],
});
