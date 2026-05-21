import { env } from "../env";
import { authClient } from "@repo/auth-mf/auth-client";
import { selectTotalItems, useCartStore } from "@repo/cart-store";
import { Image } from "@repo/ui";
import { Sun, Moon } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { getSession, type SessionData } from "../lib/session";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: env.VITE_APP_TITLE ? `${env.VITE_APP_TITLE} — Catalog` : "Micro-Frontend E-Commerce Platform — Catalog" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6">
      <h1 className="text-4xl text-destructive font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
      <Link
        to="/"
        className="text-xs uppercase tracking-[0.15em] text-primary hover:text-primary/90 transition-colors no-underline"
      >
        Return to Home
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6">
      <h1
        className="text-8xl leading-none tracking-[-0.02em] text-foreground font-display"
      >
        404
      </h1>
      <p className="text-sm text-muted-foreground tracking-wide">Page not found</p>
      <Link
        to="/"
        className="text-xs uppercase tracking-[0.15em] text-primary hover:text-primary/90 transition-colors no-underline"
      >
        Back to catalog
      </Link>
    </div>
  ),
  shellComponent: RootDocument,
  component: Layout,
});

function Layout() {
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useQuery<SessionData | null>({
    queryKey: ["session"],
    queryFn: () => getSession(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    const handler = () => queryClient.invalidateQueries({ queryKey: ["session"] });
    window.addEventListener("session-updated", handler);
    return () => window.removeEventListener("session-updated", handler);
  }, [queryClient]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    await authClient.signOut();
    queryClient.setQueryData(["session"], null);
    void router.navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-10">
              <Link to="/" className="flex-shrink-0 flex items-center group no-underline">
                <span
                  className="text-xl tracking-[0.18em] uppercase text-foreground font-display"
                >
                  {env.VITE_APP_TITLE || "Micro-Frontend E-Commerce Platform"}
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-8">
                <Link
                  to="/"
                  className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors [&.active]:text-primary no-underline"
                >
                  Catalog
                </Link>
                <Link
                  to="/dashboard"
                  className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors [&.active]:text-primary no-underline"
                >
                  Dashboard
                </Link>
                <Link
                  to="/orders"
                  className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors [&.active]:text-primary no-underline"
                >
                  Orders
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/cart"
                className="relative text-foreground hover:text-primary transition-colors group flex items-center gap-2 no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                aria-label="Shopping cart"
              >
                <span className="text-xs tracking-[0.15em] uppercase">Cart</span>
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                <CartBadge />
              </Link>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-muted-foreground hover:text-foreground transition-colors bg-none border-none cursor-pointer p-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <div className="h-3 w-px bg-border" />
              {isLoading ? (
                <div className="h-3 w-14 bg-secondary animate-pulse" />
              ) : session?.user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-secondary border border-border overflow-hidden shrink-0 flex items-center justify-center">
                      <Image
                        src={session?.user?.image}
                        alt=""
                        layout="fullWidth"
                        className="h-full w-full object-cover"
                        fallback={
                          <span className="text-[10px] font-medium text-muted-foreground uppercase">
                            {(session?.user?.name || session?.user?.email || "U").charAt(0)}
                          </span>
                        }
                      />
                    </div>
                    <span className="text-xs tracking-[0.08em] text-muted-foreground">
                      {session?.user?.name || session?.user?.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs tracking-[0.15em] uppercase text-foreground hover:text-primary transition-colors bg-none border-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-xs tracking-[0.15em] uppercase text-foreground hover:text-primary transition-colors no-underline"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main id="main-content" className="max-w-7xl mx-auto pt-20 pb-16 px-6 lg:px-12 min-h-screen relative z-10">
        <Suspense
          fallback={
            <div className="pt-12 text-center text-sm text-muted-foreground uppercase tracking-[0.12em]">
              Loading...
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

function CartBadge() {
  const totalItems = useCartStore(selectTotalItems);
  if (totalItems === 0) return null;
  return (
    <span className="absolute -top-2 -right-3 flex items-center justify-center h-4 min-w-[1rem] px-1 bg-primary text-[9px] font-bold text-white leading-none tracking-[0.02em]">
      {totalItems > 99 ? "99+" : totalItems}
    </span>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:border-border focus:text-sm focus:uppercase focus:tracking-[0.12em]"
        >
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
