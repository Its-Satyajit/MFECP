import { federation } from "@module-federation/vite";
import babel from "@rolldown/plugin-babel";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		viteReact({
			babel: {
				presets: [reactCompilerPreset()],
			},
		}),
		federation({
			name: "cart",
			filename: "remoteEntry.js",
			exposes: {
				"./cart": "./src/export.ts",
			},
			shared: {
				react: { singleton: true },
				"react-dom": { singleton: true },
				"react/jsx-runtime": { singleton: true },
				"react/jsx-dev-runtime": { singleton: true },
				"react-dom/client": { singleton: true },
				"@repo/cart-store": { singleton: true },
				"@tanstack/react-router": { singleton: true },
				"@tanstack/react-form": { singleton: true },
			},
			dts: false,
		}),
	],
	build: {
		target: "chrome89",
	},
	server: {
		cors: true,
	},
});
