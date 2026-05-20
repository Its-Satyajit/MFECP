import { clientLazy } from "./client-lazy";
import { loadRemote } from "@module-federation/enhanced/runtime";

export const ProductsPage = clientLazy(() =>
	loadRemote("product/product").then((m: any) => {
		console.log("Loaded product module via loadRemote:", m);
		return { default: m.ProductsPage || m.default?.ProductsPage || m.default };
	})
);

export const ProductPage = clientLazy(() =>
	loadRemote("product/product").then((m: any) => {
		return { default: m.ProductPage || m.default?.ProductPage || m.default };
	})
);
