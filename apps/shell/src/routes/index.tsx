import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "../remotes/product";

export const Route = createFileRoute("/")({
	component: ProductsPage,
});
