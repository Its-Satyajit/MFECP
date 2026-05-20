import type { DashboardMetrics } from "@repo/types";
import { Skeleton } from "@repo/ui";
import { useQuery } from "@tanstack/react-query";
import {
	DollarSign,
	Package,
	ShoppingCart,
	Star,
	Tag,
	TrendingUp,
	Users,
} from "lucide-react";
import { treatyClient } from "../lib/api";

function StatCard({
	icon: Icon,
	label,
	value,
	sub,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string;
	sub?: string;
}) {
	return (
		<div className="border border-[#d4cec4] p-5 lg:p-6">
			<div className="flex items-start justify-between mb-3">
				<span className="text-[10px] uppercase tracking-[0.12em] text-[#9a9690]">
					{label}
				</span>
				<Icon className="h-4 w-4 text-[#9a9690]" />
			</div>
			<p
				className="text-3xl md:text-4xl leading-none tracking-[-0.02em] text-[#1a1a1a] tabular-nums"
				style={{ fontFamily: "'Anton', sans-serif" }}
			>
				{value}
			</p>
			{sub && (
				<p className="text-xs text-[#6b6760] mt-2 tracking-wide">{sub}</p>
			)}
		</div>
	);
}

function SectionHeading({ children }: { children: React.ReactNode }) {
	return (
		<h2
			className="text-xl md:text-2xl leading-none tracking-[-0.02em] text-[#1a1a1a] mb-5"
			style={{ fontFamily: "'Anton', sans-serif" }}
		>
			{children}
		</h2>
	);
}

export function DashboardPage() {
	const { data, isLoading } = useQuery<DashboardMetrics>({
		queryKey: ["dashboard-metrics"],
		queryFn: async () => {
			const { data, error } = await treatyClient.api.dashboard.metrics.get();
			if (error) throw error;
			return data;
		},
	});

	if (isLoading) {
		return (
			<div className="animate-in fade-in duration-500 space-y-10">
				<div className="mb-10 border-b border-[#d4cec4] pb-6">
					<Skeleton className="h-4 w-24 mb-2 bg-[#eae6de]" />
					<Skeleton className="h-12 w-56 bg-[#eae6de]" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="border border-[#d4cec4] p-5 lg:p-6 space-y-3">
							<Skeleton className="h-3 w-20 bg-[#eae6de]" />
							<Skeleton className="h-8 w-24 bg-[#eae6de]" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="animate-in fade-in duration-500">
				<div className="mb-10 border-b border-[#d4cec4] pb-6">
					<p className="kicker mb-1">Analytics</p>
					<h1
						className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-[#1a1a1a]"
						style={{ fontFamily: "'Anton', sans-serif" }}
					>
						DASHBOARD
					</h1>
				</div>
				<p className="text-sm text-[#6b6760]">Unable to load dashboard data.</p>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in duration-500 space-y-10">
			<div className="mb-10 border-b border-[#d4cec4] pb-6">
				<p className="kicker mb-1">Analytics</p>
				<h1
					className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-[#1a1a1a]"
					style={{ fontFamily: "'Anton', sans-serif" }}
				>
					DASHBOARD
				</h1>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					icon={DollarSign}
					label="Revenue"
					value={`$${data.revenue.totalRevenue.toLocaleString()}`}
				/>
				<StatCard
					icon={ShoppingCart}
					label="Orders"
					value={data.revenue.totalOrders.toString()}
				/>
				<StatCard
					icon={Users}
					label="Customers"
					value={data.userCount.toString()}
				/>
				<StatCard
					icon={Package}
					label="Products"
					value={data.productStats.total.toString()}
				/>
			</div>

			{data.topRated && data.topRated.length > 0 && (
				<div>
					<SectionHeading>Top Rated Products</SectionHeading>
					<div className="border border-[#d4cec4] divide-y divide-[#d4cec4]">
						{data.topRated.map((product) => (
							<div
								key={product.id}
								className="flex items-center gap-4 p-4 lg:p-5"
							>
								<div className="h-12 w-12 bg-[#f8f6f0] border border-[#e0dbd2] flex items-center justify-center shrink-0 overflow-hidden">
									<img
										src={product.image_url}
										alt=""
										className="h-full w-full object-contain p-1"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-[#1a1a1a] truncate font-medium">
										{product.name}
									</p>
									<div className="flex items-center gap-3 mt-0.5">
										<div className="flex items-center gap-1">
											<Star className="h-3 w-3 text-[#ff4d00] fill-[#ff4d00]" />
											<span className="text-xs text-[#6b6760]">
												{product.rating?.rate ?? "—"}
											</span>
										</div>
										<span className="text-xs text-[#9a9690]">
											{product.rating?.count ?? 0} reviews
										</span>
									</div>
								</div>
								<span className="text-sm font-bold text-[#1a1a1a] shrink-0">
									${product.price}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{data.productStats.categories && data.productStats.categories.length > 0 && (
				<div>
					<SectionHeading>Categories</SectionHeading>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{data.productStats.categories.map((cat) => (
							<div
								key={cat.name}
								className="border border-[#d4cec4] p-5 lg:p-6"
							>
								<div className="flex items-center gap-2 mb-2">
									<Tag className="h-4 w-4 text-[#ff4d00]" />
									<span className="text-xs uppercase tracking-[0.1em] text-[#6b6760]">
										{cat.name}
									</span>
								</div>
								<p
									className="text-2xl leading-none tracking-[-0.02em] text-[#1a1a1a] tabular-nums"
									style={{ fontFamily: "'Anton', sans-serif" }}
								>
									{cat.count}
								</p>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{data.recentProducts && data.recentProducts.length > 0 && (
					<div>
						<SectionHeading>Recent Products</SectionHeading>
						<div className="border border-[#d4cec4] divide-y divide-[#d4cec4]">
							{data.recentProducts.map((product) => (
								<div
									key={product.id}
									className="flex items-center gap-4 p-4 lg:p-5"
								>
									<div className="h-12 w-12 bg-[#f8f6f0] border border-[#e0dbd2] flex items-center justify-center shrink-0 overflow-hidden">
										<img
											src={product.image_url}
											alt=""
											className="h-full w-full object-contain p-1"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm text-[#1a1a1a] truncate">
											{product.name}
										</p>
										<p className="text-xs text-[#6b6760] mt-0.5 capitalize">
											{product.category}
										</p>
									</div>
									<span className="text-sm font-bold text-[#1a1a1a] shrink-0">
										${product.price}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{data.recentUsers && data.recentUsers.length > 0 && (
					<div>
						<SectionHeading>Recent Registrations</SectionHeading>
						<div className="border border-[#d4cec4] divide-y divide-[#d4cec4]">
							{data.recentUsers.map((user) => (
								<div
									key={user.id}
									className="flex items-center gap-4 p-4 lg:p-5"
								>
									<div className="h-10 w-10 rounded-full bg-[#f8f6f0] border border-[#e0dbd2] flex items-center justify-center shrink-0 overflow-hidden">
										{user.image ? (
											<img
												src={user.image}
												alt=""
												className="h-full w-full object-cover"
											/>
										) : (
											<span className="text-xs font-bold uppercase text-[#6b6760]">
												{(user.name || user.email || "?").charAt(0)}
											</span>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm text-[#1a1a1a] truncate font-medium">
											{user.name || "Unknown"}
										</p>
										<p className="text-xs text-[#6b6760] mt-0.5 truncate">
											{user.email}
										</p>
									</div>
									<TrendingUp className="h-4 w-4 text-[#9a9690] shrink-0" />
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
