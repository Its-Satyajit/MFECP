import { federation } from "@module-federation/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		viteReact({}),
		federation({
			name: "cart",
			filename: "remoteEntry.js",
			exposes: {
				"./cart": "./src/export.ts",
			},
			shared: {
				react: { singleton: true, version: "19.2.6", requiredVersion: "^19.2.6" },
				"react-dom": { singleton: true, version: "19.2.6", requiredVersion: "^19.2.6" },
				"react/jsx-runtime": { singleton: true, version: "19.2.6", requiredVersion: "^19.2.6" },
				"react/jsx-dev-runtime": { singleton: true, version: "19.2.6", requiredVersion: "^19.2.6" },
				"react-dom/client": { singleton: true, version: "19.2.6", requiredVersion: "^19.2.6" },
				"@repo/cart-store": { singleton: true },
				"@tanstack/react-router": { singleton: true },
				"@tanstack/react-form": { singleton: true },
				"lucide-react": { singleton: true, version: "1.16.0", requiredVersion: "*" },
				"@repo/ui": { singleton: true, version: "1.0.0", requiredVersion: "*" },
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
