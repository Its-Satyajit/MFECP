import { federation } from "@module-federation/vite";
import babel from "@rolldown/plugin-babel";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
		federation({
			name: "product",
			filename: "remoteEntry.js",
			exposes: {
				"./product": "./src/export.ts",
			},
			shared: {
				react: { singleton: true },
				"react-dom": { singleton: true },
				"@repo/cart-store": { singleton: true },
			},
		}),
	],
	build: {
		target: "chrome89",
	},
	server: {
		cors: true,
	},
});
