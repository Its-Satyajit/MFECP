import { treatyClient } from "@repo/commerce-mf/api";
import type { Order } from "@repo/types";
import { Skeleton } from "@repo/ui";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";

export function OrdersPage() {
	const { data: orders = [], isLoading } = useQuery<Order[]>({
		queryKey: ["orders"],
		queryFn: async () => {
			const { data, error } = await treatyClient.api.orders.get();
			if (error) throw error;
			return data;
		},
	});

	if (isLoading) {
		return (
			<div className="animate-in fade-in duration-500">
				<div className="mb-10 border-b border-[#d4cec4] pb-6">
					<Skeleton className="h-4 w-24 mb-2 bg-[#eae6de]" />
					<Skeleton className="h-12 w-48 bg-[#eae6de]" />
				</div>
				<div className="border border-[#d4cec4] divide-y divide-[#d4cec4]">
					{Array.from({ length: 3 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <Skeleton>
						<div key={i} className="p-6 space-y-4">
							<div className="flex justify-between">
								<div className="space-y-2">
									<Skeleton className="h-3 w-16 bg-[#eae6de]" />
									<Skeleton className="h-4 w-48 bg-[#eae6de]" />
								</div>
								<div className="space-y-2 text-right">
									<Skeleton className="h-3 w-24 bg-[#eae6de]" />
									<Skeleton className="h-5 w-20 bg-[#eae6de]" />
								</div>
							</div>
							<div className="thin-divider" />
							{Array.from({ length: 2 }).map((_, j) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <Skeleton>
								<div key={j} className="flex items-center gap-3">
									<Skeleton className="h-12 w-12 bg-[#eae6de]" />
									<Skeleton className="h-4 flex-1 bg-[#eae6de]" />
									<Skeleton className="h-4 w-16 bg-[#eae6de]" />
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="animate-in fade-in duration-500">
				<div className="mb-10 border-b border-[#d4cec4] pb-6">
					<p className="kicker mb-1">Account</p>
					<h1
						className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-[#1a1a1a]"
						style={{ fontFamily: "'Anton', sans-serif" }}
					>
						ORDERS
					</h1>
				</div>
				<div className="border border-[#d4cec4] p-12 lg:p-16 text-center">
					<Package className="h-10 w-10 mx-auto mb-4 text-[#9a9690]" />
					<p className="text-sm text-[#6b6760] mb-1">No orders yet</p>
					<p className="text-xs text-[#9a9690]">
						Your orders will appear here once you make a purchase.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in duration-500">
			<div className="mb-10 border-b border-[#d4cec4] pb-6">
				<p className="kicker mb-1">Account</p>
				<h1
					className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-[#1a1a1a]"
					style={{ fontFamily: "'Anton', sans-serif" }}
				>
					ORDERS
				</h1>
				<p className="text-xs text-[#6b6760] mt-2 tracking-wide">
					{orders.length} order{orders.length !== 1 ? "s" : ""}
				</p>
			</div>

			<div className="space-y-6">
				{orders.map((order) => (
					<div
						key={order.id}
						className="border border-[#d4cec4] divide-y divide-[#d4cec4]"
					>
						<div className="flex items-center justify-between p-4 lg:p-5 bg-[#f8f6f0]">
							<div>
								<p className="text-[10px] uppercase tracking-[0.12em] text-[#6b6760]">
									Order placed
								</p>
								<p className="text-sm text-[#1a1a1a] mt-0.5">
									{new Date(order.createdAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
							<div className="text-right">
								<p className="text-[10px] uppercase tracking-[0.12em] text-[#6b6760]">
									Total
								</p>
								<p
									className="text-lg leading-none tracking-[-0.02em] text-[#ff4d00] mt-0.5"
									style={{ fontFamily: "'Anton', sans-serif" }}
								>
									${order.total.toFixed(2)}
								</p>
							</div>
						</div>

						{order.items?.map((item) => (
							<div
								key={item.id}
								className="flex items-center gap-4 p-4 lg:p-5"
							>
								<div className="h-16 w-16 bg-[#f8f6f0] border border-[#e0dbd2] flex items-center justify-center shrink-0 overflow-hidden">
									<img
										src={item.image}
										alt={item.title}
										className="h-full w-full object-contain p-1.5"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-[#1a1a1a] truncate font-medium">
										{item.title}
									</p>
									<div className="flex items-center gap-3 mt-1">
										<span className="text-xs text-[#6b6760]">
											Qty: {item.quantity}
										</span>
										<span className="text-xs text-[#9a9690]">·</span>
										<span className="text-xs text-[#6b6760]">
											${item.price.toFixed(2)} each
										</span>
									</div>
								</div>
								<span className="text-sm font-bold text-[#1a1a1a] shrink-0">
									${(item.price * item.quantity).toFixed(2)}
								</span>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
