import { init } from "@module-federation/enhanced/runtime";
import * as CartStore from "@repo/cart-store";
import * as ReactQuery from "@tanstack/react-query";
import * as ReactRouter from "@tanstack/react-router";
import * as ReactForm from "@tanstack/react-form";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactJsxRuntime from "react/jsx-runtime";
import * as ReactJsxDevRuntime from "react/jsx-dev-runtime";
import * as ReactDomClient from "react-dom/client";

const isServer = typeof window === "undefined";

let mfInitPromise: Promise<void> | null = null;

function ensureMfRuntime(): Promise<void> {
	if (!mfInitPromise) {
		mfInitPromise = (async () => {
			try {
			init({
				name: "shell",
				remotes: [
					{
						name: "auth",
						entry: "http://localhost:3001/remoteEntry.js",
						type: "module",
					},
					{
						name: "product",
						entry: "http://localhost:3002/remoteEntry.js",
						type: "module",
					},
					{
						name: "cart",
						entry: "http://localhost:3003/remoteEntry.js",
						type: "module",
					},
					{
						name: "order",
						entry: "http://localhost:3004/remoteEntry.js",
						type: "module",
					},
					{
						name: "dashboard",
						entry: "http://localhost:3005/remoteEntry.js",
						type: "module",
					},
				],
				shared: {
					react: {
						version: "19.2.6",
						scope: "default",
						lib: () => React,
						shareConfig: { singleton: true, requiredVersion: "^19.2.6" },
					},
					"react-dom": {
						version: "19.2.6",
						scope: "default",
						lib: () => ReactDOM,
						shareConfig: { singleton: true, requiredVersion: "^19.2.6" },
					},
					"react/jsx-runtime": {
						version: "19.2.6",
						scope: "default",
						lib: () => ReactJsxRuntime,
						shareConfig: { singleton: true, requiredVersion: "^19.2.6" },
					},
					"react/jsx-dev-runtime": {
						version: "19.2.6",
						scope: "default",
						lib: () => ReactJsxDevRuntime,
						shareConfig: { singleton: true, requiredVersion: "^19.2.6" },
					},
					"react-dom/client": {
						version: "19.2.6",
						scope: "default",
						lib: () => ReactDomClient,
						shareConfig: { singleton: true, requiredVersion: "^19.2.6" },
					},
					"@tanstack/react-form": {
						version: "1.32.0",
						scope: "default",
						lib: () => ReactForm,
						shareConfig: { singleton: true },
					},
					"@tanstack/react-router": {
						version: "1.0.0",
						scope: "default",
						lib: () => ReactRouter,
						shareConfig: { singleton: true },
					},
					"@tanstack/react-query": {
						version: "5.0.0",
						scope: "default",
						lib: () => ReactQuery,
						shareConfig: { singleton: true },
					},
					"@repo/cart-store": {
						version: "1.0.0",
						scope: "default",
						lib: () => CartStore,
						shareConfig: { singleton: true },
					},
				},
			});

			// Directly populate __FEDERATION__.__SHARE__ with lib factories,
			// because init() registers keys but doesn't set version/singleton/lib.
			// The Vite middleware uses __SHARE__ to resolve shared imports; without
			// lib factories, remotes fall back to loading their own React copies.
			const shareByProvider = (globalThis as any).__FEDERATION__?.__SHARE__;
			if (shareByProvider) {
				const pkgs: Array<[string, any, string]> = [
					["react", React, "^19.2.6"],
					["react-dom", ReactDOM, "^19.2.6"],
					["react/jsx-runtime", ReactJsxRuntime, "^19.2.6"],
					["react/jsx-dev-runtime", ReactJsxDevRuntime, "^19.2.6"],
					["react-dom/client", ReactDomClient, "^19.2.6"],
					["@tanstack/react-form", ReactForm, undefined],
					["@tanstack/react-router", ReactRouter, undefined],
					["@tanstack/react-query", ReactQuery, undefined],
					["@repo/cart-store", CartStore, undefined],
				];
				for (const scopeName of Object.keys(shareByProvider)) {
					const defaultScope = shareByProvider[scopeName]?.default;
					if (!defaultScope) continue;
					for (const [name, mod, reqVer] of pkgs) {
						if (defaultScope[name]) {
							defaultScope[name].lib = () => mod;
							defaultScope[name].shareConfig = { singleton: true, ...(reqVer ? { requiredVersion: reqVer } : {}) };
							defaultScope[name].version = "19.2.6";
							defaultScope[name].from = "shell";
						}
					}
				}
			}

				// We must also resolve the Vite plugin's internal promise
				const globalKey = "__mf_init__virtual:mf:__mfe_internal__shell__mf_v__runtimeInit__mf_v__.js__";
				if (!(globalThis as any)[globalKey]) {
					const p = Promise.resolve() as any;
					p.resolved = true;
					(globalThis as any)[globalKey] = {
						initPromise: p,
						initResolve: () => {},
						initReject: () => {},
					};
				} else {
					const state = (globalThis as any)[globalKey];
					if (state.initResolve) state.initResolve();
					if (state.initPromise) state.initPromise.resolved = true;
				}
			} catch (e) {
				console.error("MF runtime init failed:", e);
			}
		})();
	}
	return mfInitPromise;
}

export function clientLazy<T extends React.ComponentType<any>>(
	factory: () => Promise<{ default: T }>,
): React.FC<React.ComponentProps<T>> {
	if (isServer) {
		return (() => null) as unknown as React.FC<React.ComponentProps<T>>;
	}

	// Defer React.lazy creation until after MF runtime is guaranteed initialized.
	// Previously, React.lazy(factory) ran at module-load time, which could race
	// against the MF runtime init on remount/HMR.
	let LazyComp: React.LazyExoticComponent<T> | null = null;

	function Wrapper(props: React.ComponentProps<T>) {
		const [ready, setReady] = React.useState(false);

		React.useEffect(() => {
			let cancelled = false;
			ensureMfRuntime().then(() => {
				if (!cancelled) {
					if (!LazyComp) {
						LazyComp = React.lazy(factory);
					}
					setReady(true);
				}
			});
			return () => {
				cancelled = true;
			};
		}, []);

		if (!ready || !LazyComp) return null;

		const Comp = LazyComp;
		return (
			<React.Suspense fallback={null}>
				<Comp {...props} />
			</React.Suspense>
		);
	}

	return Wrapper as unknown as React.FC<React.ComponentProps<T>>;
}
