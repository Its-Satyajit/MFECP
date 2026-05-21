import { authClient } from "@repo/auth-mf/auth-client";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
	useRouter,
} from "@tanstack/react-router";
import { Menu, Moon, ShoppingCart, Sun, X } from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";

const CartBadge = lazy(() => import("../components/cart-badge").then((m) => ({ default: m.CartBadge })));
import { getSession, type SessionData } from "../lib/session";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{
				title: "Micro-Frontend E-Commerce Platform — Catalog",
			},
		],
		links: [
			{ rel: "stylesheet", href: appCss },
		],
	}),
	errorComponent: ({ error }) => (
		<div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6">
			<h1 className="text-4xl text-destructive font-bold">
				Something went wrong
			</h1>
			<p className="text-muted-foreground">
				{error.message || "An unexpected error occurred."}
			</p>
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
			<h1 className="text-8xl leading-none tracking-[-0.02em] text-foreground font-display">
				404
			</h1>
			<p className="text-sm text-muted-foreground tracking-wide">
				Page not found
			</p>
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
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [theme, setTheme] = useState<"light" | "dark">(() => {
		if (typeof window === "undefined") return "light";
		return (localStorage.getItem("theme") as "light" | "dark") || "light";
	});

	useEffect(() => {
		const handler = () =>
			queryClient.invalidateQueries({ queryKey: ["session"] });
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
						<div className="flex items-center gap-2 sm:gap-4 md:gap-10">
							<button
								type="button"
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="md:hidden text-foreground hover:text-primary transition-colors bg-none border-none cursor-pointer p-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
								aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
							>
								{mobileMenuOpen ? (
									<X className="h-5 w-5" />
								) : (
									<Menu className="h-5 w-5" />
								)}
							</button>
							<Link
								to="/"
								className="flex-shrink-0 flex items-center group no-underline"
							>
								<span className="text-sm sm:text-lg md:text-xl tracking-[0.18em] uppercase text-foreground font-display">
									MFECP
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
						<div className="flex items-center gap-4">
							<Link
								to="/cart"
								className="relative text-foreground hover:text-primary transition-colors group flex items-center gap-1.5 sm:gap-2 no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
								aria-label="Shopping cart"
							>
								<span className="hidden sm:inline text-xs tracking-[0.15em] uppercase">
									Cart
								</span>
								<ShoppingCart className="h-4 w-4" aria-hidden="true" />
								<Suspense fallback={null}><CartBadge /></Suspense>
							</Link>
							<button
								type="button"
								onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
								className="text-muted-foreground hover:text-foreground transition-colors bg-none border-none cursor-pointer p-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
								aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
							>
								{theme === "dark" ? (
									<Sun className="h-4 w-4" />
								) : (
									<Moon className="h-4 w-4" />
								)}
							</button>
							<div className="h-3 w-px bg-border" />
							{isLoading ? (
								<div className="h-3 w-14 bg-secondary animate-pulse" />
							) : session?.user ? (
								<div className="flex items-center gap-3">
									<div className="hidden sm:flex items-center gap-2">
										<div className="h-7 w-7 rounded-full bg-secondary border border-border overflow-hidden shrink-0 flex items-center justify-center">
											<UserAvatar
												src={session?.user?.image}
												name={session?.user?.name}
												email={session?.user?.email}
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
			{mobileMenuOpen && (
				<div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border md:hidden">
					<div className="flex flex-col px-6 py-4 gap-3">
						<Link
							to="/"
							onClick={() => setMobileMenuOpen(false)}
							className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors [&.active]:text-primary no-underline py-2"
						>
							Catalog
						</Link>
						<Link
							to="/dashboard"
							onClick={() => setMobileMenuOpen(false)}
							className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors [&.active]:text-primary no-underline py-2"
						>
							Dashboard
						</Link>
						<Link
							to="/orders"
							onClick={() => setMobileMenuOpen(false)}
							className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors [&.active]:text-primary no-underline py-2"
						>
							Orders
						</Link>
					</div>
				</div>
			)}
			<main
				id="main-content"
				className="max-w-7xl mx-auto pt-20 pb-16 px-6 lg:px-12 min-h-screen relative z-10"
			>
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

function UserAvatar({
	src,
	name,
	email,
}: {
	src?: string | null;
	name?: string;
	email?: string;
}) {
	const [error, setError] = useState(false);
	if (!src || error) {
		return (
			<span className="text-[10px] font-medium text-muted-foreground uppercase">
				{(name || email || "U").charAt(0)}
			</span>
		);
	}
	return (
		<img
			src={src}
			alt=""
			className="h-full w-full object-cover"
			onError={() => setError(true)}
		/>
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
