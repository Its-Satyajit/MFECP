import { clientLazy, loadMfRemote } from "./client-lazy";

export const ProductsPage = clientLazy(() =>
	loadMfRemote("product/product").then((m: any) => {
		return { default: m.ProductsPage || m.default?.ProductsPage || m.default };
	})
);

export const ProductPage = clientLazy(() =>
	loadMfRemote("product/product").then((m: any) => {
		return { default: m.ProductPage || m.default?.ProductPage || m.default };
	})
);
