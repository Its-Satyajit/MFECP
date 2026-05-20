import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
	id: number;
	title: string;
	price: number;
	image: string;
	quantity: number;
}

interface CartState {
	items: CartItem[];
	addItem: (product: Omit<CartItem, "quantity">) => void;
	removeItem: (id: number) => void;
	updateQuantity: (id: number, quantity: number) => void;
	clearCart: () => void;
}

export const useCartStore = create<CartState>()(
	persist(
		(set) => ({
			items: [],
			addItem: (product) =>
				set((state) => {
					const existing = state.items.find((i) => i.id === product.id);
					if (existing) {
						return {
							items: state.items.map((i) =>
								i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
							),
						};
					}
					return { items: [...state.items, { ...product, quantity: 1 }] };
				}),
			removeItem: (id) =>
				set((state) => ({
					items: state.items.filter((i) => i.id !== id),
				})),
			updateQuantity: (id, quantity) =>
				set((state) => {
					if (quantity <= 0) {
						return { items: state.items.filter((i) => i.id !== id) };
					}
					return {
						items: state.items.map((i) =>
							i.id === id ? { ...i, quantity } : i,
						),
					};
				}),
			clearCart: () => set({ items: [] }),
		}),
		{ name: "micro-frontend-e-commerce-platform-cart" },
	),
);

export const selectTotalItems = (state: CartState) =>
	state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectTotalPrice = (state: CartState) =>
	state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
