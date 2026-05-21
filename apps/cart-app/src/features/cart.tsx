import { selectTotalItems, selectTotalPrice, useCartStore } from "@repo/cart-store";
import { Button, Image } from "@repo/ui";
import { Link, useRouter } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

const formatUSD = (amount: number) =>
  new Intl.NumberFormat((navigator as any)?.languages ?? "en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

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
				<div className="mb-10 border-b border-border pb-6">
					<p className="kicker mb-1">Shopping</p>
					<h1
						className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-foreground font-display"
					>
						CART
					</h1>
				</div>
				<div className="border border-border p-16 text-center">
					<ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground/70 mb-4" aria-hidden="true" />
					<p className="text-muted-foreground uppercase tracking-[0.12em] mb-6">
						Your cart is empty
					</p>
					<Link to="/">
						<Button className="h-10 px-8 font-bold uppercase tracking-[0.12em] text-sm rounded-none">
							Continue Shopping
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in duration-500">
			<div className="flex items-end justify-between mb-10 border-b border-border pb-6">
				<div>
					<p className="kicker mb-1">Shopping</p>
					<h1
						className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-foreground font-display"
					>
						CART
					</h1>
					<p className="text-sm text-muted-foreground mt-3 tracking-wide">
						{totalItems} {totalItems === 1 ? "item" : "items"}
					</p>
				</div>
				<button
					type="button"
					onClick={clearCart}
					className="text-xs uppercase tracking-[0.12em] text-muted-foreground/70 hover:text-primary transition-colors bg-none border-none cursor-pointer"
				>
					Clear All
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border">
				<div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-border divide-y divide-border">
					{items.map((item) => (
						<div key={item.id} className="p-6 lg:p-8 flex gap-6">
							<div className="w-20 h-20 lg:w-24 lg:h-24 shrink-0 bg-secondary border border-border flex items-center justify-center">
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
											className="text-sm text-foreground truncate font-display"
										>
											{item.title}
										</h3>
										<span className="text-sm text-foreground font-medium shrink-0 tabular-nums">
                    {formatUSD(item.price * item.quantity)}
										</span>
									</div>
									<p className="text-xs text-muted-foreground mt-1 tabular-nums">
                    {formatUSD(item.price)} each
									</p>
								</div>
								<div className="flex items-center gap-4 mt-4">
									<div className="flex items-center border border-border">
										<button
											type="button"
											onClick={() => updateQuantity(item.id, item.quantity - 1)}
											className="w-8 h-8 flex items-center justify-center text-xs text-foreground hover:bg-secondary transition-colors bg-none border-r border-border cursor-pointer"
										>
											-
										</button>
										<span className="w-10 h-8 flex items-center justify-center text-xs text-foreground tabular-nums bg-secondary/50">
											{item.quantity}
										</span>
										<button
											type="button"
											onClick={() => updateQuantity(item.id, item.quantity + 1)}
											className="w-8 h-8 flex items-center justify-center text-xs text-foreground hover:bg-secondary transition-colors bg-none border-l border-border cursor-pointer"
										>
											+
										</button>
									</div>
									<button
										type="button"
										onClick={() => removeItem(item.id)}
										className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70 hover:text-primary transition-colors bg-none border-none cursor-pointer"
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
						className="text-lg text-foreground mb-6 font-display"
					>
						SUMMARY
					</h2>
					<div className="flex flex-col gap-3 text-sm mb-6">
						<div className="flex justify-between text-muted-foreground">
							<span>Items ({totalItems})</span>
							<span className="tabular-nums">{formatUSD(totalPrice)}</span>
						</div>
						<div className="flex justify-between text-muted-foreground">
							<span>Shipping</span>
							<span className="text-cyan">Free</span>
						</div>
					</div>
					<div className="thick-divider mb-4" />
					<div className="flex justify-between text-base text-foreground font-medium mb-8">
						<span>Total</span>
						<span className="tabular-nums">{formatUSD(totalPrice)}</span>
					</div>
					<Button
						className="w-full h-12 font-bold uppercase tracking-[0.12em] text-sm rounded-none"
						onClick={() => void router.navigate({ to: "/checkout" })}
					>
						Checkout
					</Button>
				</div>
			</div>
		</div>
	);
}
