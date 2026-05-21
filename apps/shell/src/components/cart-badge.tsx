import { selectTotalItems, useCartStore } from "@repo/cart-store";

export function CartBadge() {
	const totalItems = useCartStore(selectTotalItems);
	if (totalItems === 0) return null;
	return (
		<span className="absolute -top-2 -right-3 flex items-center justify-center h-4 min-w-[1rem] px-1 bg-primary text-[9px] font-bold text-white leading-none tracking-[0.02em]">
			{totalItems > 99 ? "99+" : totalItems}
		</span>
	);
}
