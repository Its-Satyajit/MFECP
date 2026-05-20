import { clientLazy } from "./client-lazy";

export const ProductsPage = clientLazy(
	() =>
		import("product/product").then((m) => ({ default: m.ProductsPage })),
);

export const ProductPage = clientLazy(
	() =>
		import("product/product").then((m) => ({ default: m.ProductPage })),
);
