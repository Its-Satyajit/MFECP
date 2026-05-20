import { selectTotalItems, selectTotalPrice, useCartStore } from "@repo/cart-store";
import { Button, Image } from "@repo/ui";
import { Link, useRouter } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

export function CartPage() {
	const router = useRouter();
	const items = useCartStore((s) => s.items);
	const totalItems = useCartStore(selectTotalItems);
	const totalPrice = useCartStore(selectTotalPrice);
	const updateQuantity = useCartStore((s) => s.updateQuantity);
	const removeItem = useCartStore((s) => s.removeItem);
	const clearCart = useCartStore((s) => s.clearCart);

	if (items.length === 0) {
		return (
			<div className="animate-in fade-in duration-500">
				<div className="mb-10 border-b border-[#d4cec4] pb-6">
					<p className="kicker mb-1">Shopping</p>
					<h1
						className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-[#1a1a1a]"
						style={{ fontFamily: "'Anton', sans-serif" }}
					>
						CART
					</h1>
				</div>
				<div className="border border-[#d4cec4] p-16 text-center">
					<ShoppingCart className="mx-auto h-10 w-10 text-[#9a9690] mb-4" />
					<p className="text-[#6b6760] uppercase tracking-[0.12em] mb-6">
						Your cart is empty
					</p>
					<Link to="/">
						<Button className="h-10 px-8 bg-[#ff4d00] text-white font-bold uppercase tracking-[0.12em] text-sm hover:bg-[#e65c00] transition-colors rounded-none border-none cursor-pointer">
							Continue Shopping
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in duration-500">
			<div className="flex items-end justify-between mb-10 border-b border-[#d4cec4] pb-6">
				<div>
					<p className="kicker mb-1">Shopping</p>
					<h1
						className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-[#1a1a1a]"
						style={{ fontFamily: "'Anton', sans-serif" }}
					>
						CART
					</h1>
					<p className="text-sm text-[#6b6760] mt-3 tracking-wide">
						{totalItems} {totalItems === 1 ? "item" : "items"}
					</p>
				</div>
				<button
					type="button"
					onClick={clearCart}
					className="text-xs uppercase tracking-[0.12em] text-[#9a9690] hover:text-[#ff4d00] transition-colors bg-none border-none cursor-pointer"
				>
					Clear all
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#d4cec4]">
				<div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-[#d4cec4] divide-y divide-[#d4cec4]">
					{items.map((item) => (
						<div key={item.id} className="p-6 lg:p-8 flex gap-6">
							<div className="w-20 h-20 lg:w-24 lg:h-24 shrink-0 bg-[#f0ece4] border border-[#d4cec4] flex items-center justify-center">
								<Image
									src={item.image}
									alt={item.title}
									layout="fullWidth"
									className="h-16 w-auto object-contain"
								/>
							</div>
							<div className="flex-1 min-w-0 flex flex-col justify-between">
								<div>
									<div className="flex items-start justify-between gap-4">
										<h3
											className="text-sm text-[#1a1a1a] truncate"
											style={{ fontFamily: "'Anton', sans-serif" }}
										>
											{item.title}
										</h3>
										<span className="text-sm text-[#1a1a1a] font-medium shrink-0 tabular-nums">
											${(item.price * item.quantity).toFixed(2)}
										</span>
									</div>
									<p className="text-xs text-[#6b6760] mt-1 tabular-nums">
										${item.price.toFixed(2)} each
									</p>
								</div>
								<div className="flex items-center gap-4 mt-4">
									<div className="flex items-center border border-[#d4cec4]">
										<button
											type="button"
											onClick={() => updateQuantity(item.id, item.quantity - 1)}
											className="w-8 h-8 flex items-center justify-center text-xs text-[#1a1a1a] hover:bg-[#f0ece4] transition-colors bg-none border-r border-[#d4cec4] cursor-pointer"
										>
											-
										</button>
										<span className="w-10 h-8 flex items-center justify-center text-xs text-[#1a1a1a] tabular-nums bg-[#f8f6f0]">
											{item.quantity}
										</span>
										<button
											type="button"
											onClick={() => updateQuantity(item.id, item.quantity + 1)}
											className="w-8 h-8 flex items-center justify-center text-xs text-[#1a1a1a] hover:bg-[#f0ece4] transition-colors bg-none border-l border-[#d4cec4] cursor-pointer"
										>
											+
										</button>
									</div>
									<button
										type="button"
										onClick={() => removeItem(item.id)}
										className="text-[10px] uppercase tracking-[0.12em] text-[#9a9690] hover:text-[#ff4d00] transition-colors bg-none border-none cursor-pointer"
									>
										Remove
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="lg:col-span-4 p-8 lg:p-10 flex flex-col">
					<h2
						className="text-lg text-[#1a1a1a] mb-6"
						style={{ fontFamily: "'Anton', sans-serif" }}
					>
						SUMMARY
					</h2>
					<div className="space-y-3 text-sm mb-6">
						<div className="flex justify-between text-[#6b6760]">
							<span>Items ({totalItems})</span>
							<span className="tabular-nums">${totalPrice.toFixed(2)}</span>
						</div>
						<div className="flex justify-between text-[#6b6760]">
							<span>Shipping</span>
							<span className="text-[#00b8a0]">Free</span>
						</div>
					</div>
					<div className="thick-divider mb-4" />
					<div className="flex justify-between text-base text-[#1a1a1a] font-medium mb-8">
						<span>Total</span>
						<span className="tabular-nums">${totalPrice.toFixed(2)}</span>
					</div>
					<Button
						className="w-full h-12 bg-[#ff4d00] text-white font-bold uppercase tracking-[0.12em] text-sm hover:bg-[#e65c00] transition-colors rounded-none border-none cursor-pointer"
						onClick={() => void router.navigate({ to: "/checkout" })}
					>
						Checkout
					</Button>
				</div>
			</div>
		</div>
	);
}
