import { ProductsPage } from "@repo/commerce-mf";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: ProductsPage,
});
