import { ErrorBoundary } from "react-error-boundary";
import { createInstance } from "@module-federation/enhanced/runtime";
import * as CartStore from "@repo/cart-store";
import * as ReactQuery from "@tanstack/react-query";
import * as ReactRouter from "@tanstack/react-router";
import * as ReactForm from "@tanstack/react-form";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactJsxRuntime from "react/jsx-runtime";
import * as ReactJsxDevRuntime from "react/jsx-dev-runtime";
import * as ReactDomClient from "react-dom/client";
import * as RepoUi from "@repo/ui";
import * as LucideReact from "lucide-react";
import * as SimpleIcons from "@icons-pack/react-simple-icons";
import { env } from "../env";

const isServer = typeof window === "undefined";

let mfInstance: ReturnType<typeof createInstance> | null = null;
let mfInitPromise: Promise<void> | null = null;

function preloadMfeModuleCache() {
  const cache = ((globalThis as any).__mf_module_cache__ ||= { share: {}, remote: {} });
  const share = cache.share;
  const entries: [string, any][] = [
    ["react", React],
    ["react-dom", ReactDOM],
    ["react/jsx-runtime", ReactJsxRuntime],
    ["react/jsx-dev-runtime", ReactJsxDevRuntime],
    ["react-dom/client", ReactDomClient],
    ["@tanstack/react-form", ReactForm],
    ["@tanstack/react-router", ReactRouter],
    ["@tanstack/react-query", ReactQuery],
    ["@repo/cart-store", CartStore],
    ["@repo/ui", RepoUi],
    ["lucide-react", LucideReact],
    ["@icons-pack/react-simple-icons", SimpleIcons],
  ];
  for (const [key, mod] of entries) {
    if (share[key] === undefined) {
      const exportModule = { ...mod, __esModule: true };
      share[key] = exportModule;
    }
  }
}

function ensureMfRuntime(): Promise<void> {
  if (!mfInitPromise) {
    mfInitPromise = (async () => {
      preloadMfeModuleCache();
      mfInstance = createInstance({
        name: "shell",
        version: "1.0.0",
        remotes: [
          {
            name: "auth",
            entry: `${env.VITE_REMOTE_AUTH_URL}/remoteEntry.js`,
            type: "module",
          },
          {
            name: "product",
            entry: `${env.VITE_REMOTE_PRODUCT_URL}/remoteEntry.js`,
            type: "module",
          },
          {
            name: "cart",
            entry: `${env.VITE_REMOTE_CART_URL}/remoteEntry.js`,
            type: "module",
          },
          {
            name: "order",
            entry: `${env.VITE_REMOTE_ORDER_URL}/remoteEntry.js`,
            type: "module",
          },
          {
            name: "dashboard",
            entry: `${env.VITE_REMOTE_DASHBOARD_URL}/remoteEntry.js`,
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
            shareConfig: { singleton: true, requiredVersion: "*" },
          },
          "@tanstack/react-router": {
            version: "1.170.5",
            scope: "default",
            lib: () => ReactRouter,
            shareConfig: { singleton: true, requiredVersion: "*" },
          },
          "@tanstack/react-query": {
            version: "5.100.11",
            scope: "default",
            lib: () => ReactQuery,
            shareConfig: { singleton: true, requiredVersion: "*" },
          },
          "@repo/cart-store": {
            version: "1.0.0",
            scope: "default",
            lib: () => CartStore,
            shareConfig: { singleton: true, requiredVersion: "*" },
          },
          "@repo/ui": {
            version: "1.0.0",
            scope: "default",
            lib: () => RepoUi,
            shareConfig: { singleton: true, requiredVersion: "*" },
          },
          "lucide-react": {
            version: "1.16.0",
            scope: "default",
            lib: () => LucideReact,
            shareConfig: { singleton: true, requiredVersion: "*" },
          },
          "@icons-pack/react-simple-icons": {
            version: "13.13.0",
            scope: "default",
            lib: () => SimpleIcons,
            shareConfig: { singleton: true, requiredVersion: "*" },
          },
        },
      });
    })();
  }
  return mfInitPromise;
}

export function loadMfRemote<T>(id: string): Promise<T> {
  if (!mfInstance) {
    return Promise.reject(new Error("MF runtime not initialized. Call ensureMfRuntime() first."));
  }
  return mfInstance.loadRemote(id) as Promise<T>;
}

export function clientLazy<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): React.FC<React.ComponentProps<T>> {
  if (isServer) {
    return (() => null) as unknown as React.FC<React.ComponentProps<T>>;
  }

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
      <ErrorBoundary
        fallback={
          <div className="p-4 border border-destructive bg-destructive/10 text-destructive text-sm rounded">
            Failed to load remote component.
          </div>
        }
      >
        <React.Suspense fallback={null}>
          <Comp {...props} />
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  return Wrapper as unknown as React.FC<React.ComponentProps<T>>;
}
