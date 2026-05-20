import { ProductPage } from "@repo/commerce-mf";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/product/$id")({
	component: ProductPage,
});
