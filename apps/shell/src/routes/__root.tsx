import { authClient } from "@repo/auth-mf/auth-client";
import { selectTotalItems, useCartStore } from "@repo/cart-store";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { getSession, type SessionData } from "../lib/session";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Micro-Frontend E-Commerce Platform — Catalog" },
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
	notFoundComponent: () => (
		<div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6">
			<h1
				className="text-8xl leading-none tracking-[-0.02em] text-[#1a1a1a]"
				style={{ fontFamily: "'Anton', sans-serif" }}
			>
				404
			</h1>
			<p className="text-sm text-[#6b6760] tracking-wide">Page not found</p>
			<Link
				to="/"
				className="text-xs uppercase tracking-[0.15em] text-[#ff4d00] hover:text-[#e65c00] transition-colors no-underline"
			>
				Back to catalog
			</Link>
		</div>
	),
	shellComponent: RootDocument,
	component: Layout,
});

function Layout() {
	const { data: session, isLoading } = useQuery<SessionData | null>({
		queryKey: ["session"],
		queryFn: () => getSession(),
		retry: false,
		staleTime: 5 * 60 * 1000,
	});

	const handleLogout = async () => {
		await authClient.signOut();
		window.location.href = "/";
	};

	return (
		<div className="min-h-screen bg-[#f5f2ed] text-[#1a1a1a] antialiased selection:bg-[#ff4d00] selection:text-white">
			<nav className="fixed top-0 left-0 right-0 z-50 bg-[#f5f2ed]/90 backdrop-blur-md border-b border-[#d4cec4]">
				<div className="max-w-7xl mx-auto px-6 lg:px-12">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center gap-10">
							<Link
								to="/"
								className="flex-shrink-0 flex items-center group no-underline"
							>
								<span
									className="text-xl tracking-[0.18em] uppercase text-[#1a1a1a]"
									style={{ fontFamily: "'Anton', sans-serif" }}
								>
									Micro-Frontend E-Commerce Platform
								</span>
							</Link>
							<div className="hidden md:flex items-center gap-8">
								<Link
									to="/"
									className="text-xs tracking-[0.15em] uppercase text-[#6b6760] hover:text-[#1a1a1a] transition-colors [&.active]:text-[#ff4d00] no-underline"
								>
									Catalog
								</Link>
								<Link
									to="/dashboard"
									className="text-xs tracking-[0.15em] uppercase text-[#6b6760] hover:text-[#1a1a1a] transition-colors [&.active]:text-[#ff4d00] no-underline"
								>
									Dashboard
								</Link>
								<Link
									to="/orders"
									className="text-xs tracking-[0.15em] uppercase text-[#6b6760] hover:text-[#1a1a1a] transition-colors [&.active]:text-[#ff4d00] no-underline"
								>
									Orders
								</Link>
							</div>
						</div>
						<div className="flex items-center gap-6">
							<Link
								to="/cart"
								className="relative text-[#1a1a1a] hover:text-[#ff4d00] transition-colors group flex items-center gap-2 no-underline"
								aria-label="Shopping cart"
							>
								<span className="text-xs tracking-[0.15em] uppercase">
									Cart
								</span>
								<svg
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={1.5}
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
									/>
								</svg>
								<CartBadge />
							</Link>
							<div className="h-3 w-px bg-[#d4cec4]" />
							{isLoading ? (
								<div className="h-3 w-14 bg-[#eae6de] animate-pulse" />
							) : session?.user ? (
								<div className="flex items-center gap-3">
									<div className="hidden sm:flex items-center gap-2">
										<div className="h-7 w-7 rounded-full bg-[#eae6de] border border-[#d4cec4] overflow-hidden shrink-0 flex items-center justify-center">
											{session?.user?.image ? (
												<img
													src={session.user.image}
													alt=""
													className="h-full w-full object-cover"
												/>
											) : (
												<span className="text-[10px] font-medium text-[#6b6760] uppercase">
													{(
														session?.user?.name ||
														session?.user?.email ||
														"U"
													).charAt(0)}
												</span>
											)}
										</div>
										<span className="text-xs tracking-[0.08em] text-[#6b6760]">
											{session?.user?.name || session?.user?.email}
										</span>
									</div>
									<button
										type="button"
										onClick={handleLogout}
										className="text-xs tracking-[0.15em] uppercase text-[#1a1a1a] hover:text-[#ff4d00] transition-colors bg-none border-none cursor-pointer"
									>
										Logout
									</button>
								</div>
							) : (
								<Link
									to="/login"
									className="text-xs tracking-[0.15em] uppercase text-[#1a1a1a] hover:text-[#ff4d00] transition-colors no-underline"
								>
									Log in
								</Link>
							)}
						</div>
					</div>
				</div>
			</nav>
			<main className="max-w-7xl mx-auto pt-20 pb-16 px-6 lg:px-12 min-h-screen relative z-10">
				<Suspense fallback={<div className="pt-12 text-center text-sm text-[#6b6760] uppercase tracking-[0.12em]">Loading...</div>}>
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
		<span className="absolute -top-2 -right-3 flex items-center justify-center h-4 min-w-[1rem] px-1 bg-[#ff4d00] text-[9px] font-bold text-white leading-none tracking-[0.02em]">
			{totalItems > 99 ? "99+" : totalItems}
		</span>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="bg-[#f5f2ed]">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
